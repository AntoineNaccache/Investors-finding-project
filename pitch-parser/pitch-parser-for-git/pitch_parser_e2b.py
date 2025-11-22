#!/usr/bin/env python3
"""
Pitch Deck Parser using E2B Sandboxes
Orchestrates PDF parsing in an isolated E2B sandbox environment.
"""

import os
import logging
from e2b_code_interpreter import Sandbox

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# The parsing code that will run inside the E2B sandbox
PARSING_CODE = '''
import json
import csv
import re
from typing import List, Dict
import pdfplumber
import requests

# Schema definition
SCHEMA = {
    "company_sector": "",
    "company_location": "",
    "business_model": "",
    "maturity_stage": "",
    "traction_ARR": "",
    "traction_MRR": "",
    "traction_growth": "",
    "deal_ticket_size": "",
    "deal_total_seeking": "",
    "deal_valuation": "",
    "deal_instrument": ""
}

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = "llama-3.3-70b-versatile"

def parse_pdf(pdf_path: str) -> List[str]:
    """Extract text from PDF, one string per page."""
    slides = []
    with pdfplumber.open(pdf_path) as pdf:
        for i, page in enumerate(pdf.pages, 1):
            text = page.extract_text()
            if text and text.strip():
                slides.append(text)
                print(f"Extracted text from page {i} ({len(text)} chars)")
    return slides

def clean_text(slide_text: str) -> str:
    """Clean and normalize slide text."""
    if not slide_text:
        return ""
    text = re.sub(r'\\s+', ' ', slide_text)
    lines = text.split('\\n')
    if len(lines) > 2 and lines[0].strip() == lines[-1].strip():
        lines = lines[:-1]
    cleaned = ' '.join(lines)
    cleaned = re.sub(r'\\s+', ' ', cleaned).strip()
    return cleaned

def extract_slide_fields(slide_text: str, groq_api_key: str) -> Dict[str, str]:
    """Extract structured fields from slide text using Groq API."""
    if not slide_text or not slide_text.strip():
        return SCHEMA.copy()

    prompt = f"""Extract ONLY the fields in the given schema from the following pitch deck slide text.
If a field is not present in the text, leave it as an empty string.

Field extraction guidelines:
- business_model: B2B, B2C, B2B2C, etc.
- deal_ticket_size: Individual investment ticket size (e.g., "$100K-$500K")
- deal_total_seeking: Total amount the company is raising (e.g., "$2M", "€5M")
- deal_instrument: Type of investment - MUST be ONLY "SAFE" or "Priced Round". If the text mentions Series A/B/C, equity round, or any priced equity deal, use "Priced Round". If it mentions SAFE or simple agreement, use "SAFE"

IMPORTANT: For traction fields, follow these strict rules.

### TRACTION (ARR, MRR, Growth)

IMPORTANT: You MUST distinguish between ACV and MRR.

- ACV (Annual Contract Value) is NOT MRR.
- If a slide contains both ACV and MRR, ignore ACV when extracting traction_MRR.

Explicit rules:
1. traction_MRR:
   - ONLY extract the number that appears directly with "MRR".
   - Valid formats: "15k MRR", "€15k MRR", "$15k MRR".
   - DO NOT extract ACV ("€2k ACV", "2k Monthly ACV") as MRR.
   - If both ACV and MRR appear, MRR overrides all other numbers.
   - DO NOT confuse growth multipliers (like "150x", "1000x") with MRR.

2. traction_ARR:
   - ONLY extract the number next to "ARR".
   - Valid formats: "180k ARR", "€180k ARR".
   - DO NOT convert MRR or ACV into ARR.
   - DO NOT use growth multipliers in any ARR field.

IMPORTANT: To prevent incorrect ARR extraction:

1. If the slide explicitly contains a value next to the label "ARR",
   you MUST extract that value EXACTLY as traction_ARR.

2. If a number appears WITHOUT the label "ARR",
   DO NOT treat it as ARR. Ignore it for traction_ARR.

3. DO NOT infer ARR by multiplying MRR.
   (Only do this if no ARR label exists — see rule 5 below.)

4. DO NOT use growth multipliers (150x, 1000x) for ARR.

5. Only if NO explicit ARR value appears on any slide:
      - Then set traction_ARR = 12 × traction_MRR.
      - Return the numeric multiple with the same suffix (e.g., "k").

6. Reject any ARR values greater than 50× MRR as invalid hallucinations.
   If this occurs, use:
      - the ARR value with the "ARR" label, or
      - 12 × MRR fallback.

3. traction_growth:
   - ONLY extract growth rates like "150x", "1000x", "%", "YoY".
   - NEVER place growth multipliers into traction_ARR or traction_MRR.

4. Reject these from MRR:
   - ACV, "Monthly ACV", "ARPU", "Revenue per user", "Margin".

If both MRR and ACV appear:
   - traction_MRR = MRR value
   - ACV is ignored

### Always return numbers exactly as shown (e.g., "15k", "180k"), without converting or interpreting.

Return STRICT JSON ONLY in this exact schema format:

{json.dumps(SCHEMA, indent=2)}

Slide text:
{slide_text}

Return only valid JSON, no explanation or additional text."""

    headers = {
        "Authorization": f"Bearer {groq_api_key}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": GROQ_MODEL,
        "messages": [
            {"role": "system", "content": "You are a precise data extraction assistant. Always return valid JSON matching the exact schema provided."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0,
        "max_tokens": 500
    }

    try:
        response = requests.post(GROQ_API_URL, headers=headers, json=payload, timeout=30)
        response.raise_for_status()
        result = response.json()

        if 'choices' not in result or len(result['choices']) == 0:
            return SCHEMA.copy()

        content = result['choices'][0]['message']['content'].strip()

        if content.startswith('```json'):
            content = content.replace('```json', '').replace('```', '').strip()
        elif content.startswith('```'):
            content = content.replace('```', '').strip()

        extracted = json.loads(content)
        final_result = SCHEMA.copy()
        for key in SCHEMA.keys():
            if key in extracted and extracted[key]:
                final_result[key] = str(extracted[key]).strip()

        return final_result
    except Exception as e:
        print(f"Error during extraction: {e}")
        return SCHEMA.copy()

def aggregate_results(results: List[Dict[str, str]]) -> Dict[str, str]:
    """Aggregate extracted fields from multiple slides."""
    final = SCHEMA.copy()
    first_wins = {'company_sector', 'company_location', 'business_model',
                  'maturity_stage', 'deal_ticket_size', 'deal_total_seeking', 'deal_valuation', 'deal_instrument'}
    latest_wins = {'traction_ARR', 'traction_MRR', 'traction_growth'}

    for field in first_wins:
        for result in results:
            if result.get(field, '').strip():
                final[field] = result[field].strip()
                break

    for field in latest_wins:
        for result in reversed(results):
            if result.get(field, '').strip():
                final[field] = result[field].strip()
                break

    return final

def write_csv(final_json: Dict[str, str], output_path: str) -> None:
    """Write final JSON to CSV with one row."""
    with open(output_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=list(SCHEMA.keys()))
        writer.writeheader()
        writer.writerow(final_json)
    print(f"CSV written to: {output_path}")

# Main execution
pdf_path = "/tmp/pitch.pdf"
output_path = "/tmp/parsed_pitch.csv"
groq_api_key = "{GROQ_API_KEY}"

print("Starting pitch deck parsing...")
slides = parse_pdf(pdf_path)
print(f"Parsed {len(slides)} slides")

cleaned_slides = [clean_text(slide) for slide in slides]
print("Text cleaned")

extracted_results = []
for i, slide_text in enumerate(cleaned_slides, 1):
    print(f"Processing slide {i}/{len(cleaned_slides)}")
    result = extract_slide_fields(slide_text, groq_api_key)
    extracted_results.append(result)

final_json = aggregate_results(extracted_results)
print("Results aggregated")
print("Final data:", json.dumps(final_json, indent=2))

write_csv(final_json, output_path)
print("Pipeline complete!")
'''


def run_pitch_parser(pdf_path: str, groq_api_key: str, e2b_api_key: str = None):
    """
    Main orchestrator that runs pitch deck parsing in an E2B sandbox.

    Args:
        pdf_path: Local path to the PDF file
        groq_api_key: Groq API key for LLM extraction
        e2b_api_key: E2B API key (if not set in environment)
    """
    logger.info("=" * 60)
    logger.info("Starting Pitch Deck Parser with E2B")
    logger.info("=" * 60)

    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"PDF file not found: {pdf_path}")

    if not groq_api_key:
        raise ValueError("GROQ_API_KEY is required")

    try:
        # Create E2B sandbox
        logger.info("Creating E2B sandbox...")
        sandbox_kwargs = {}
        if e2b_api_key:
            sandbox_kwargs['api_key'] = e2b_api_key

        with Sandbox.create(**sandbox_kwargs) as sandbox:
            logger.info(f"Sandbox created: {sandbox.sandbox_id}")

            # Install dependencies
            logger.info("Installing dependencies in sandbox...")
            install_result = sandbox.commands.run('pip install pdfplumber requests')
            if install_result.exit_code != 0:
                logger.error(f"Failed to install packages: {install_result.stderr}")
                raise RuntimeError("Package installation failed")
            logger.info("Dependencies installed successfully")

            # Upload PDF to sandbox
            logger.info(f"Uploading PDF: {pdf_path}")
            with open(pdf_path, 'rb') as f:
                sandbox.files.write('/tmp/pitch.pdf', f)
            logger.info("PDF uploaded to /tmp/pitch.pdf")

            # Execute parsing code
            logger.info("Executing parsing pipeline in sandbox...")
            code_to_run = PARSING_CODE.replace('{GROQ_API_KEY}', groq_api_key)

            execution = sandbox.run_code(code_to_run)

            # Check for errors
            if execution.error:
                logger.error(f"Execution error: {execution.error}")
                raise RuntimeError(f"Parsing failed: {execution.error}")

            # Print execution logs
            if execution.logs:
                logger.info("Execution logs:")
                logger.info(execution.logs.stdout)
                if execution.logs.stderr:
                    logger.warning(f"Stderr: {execution.logs.stderr}")

            # Download the result CSV
            logger.info("Downloading result CSV...")
            csv_content = sandbox.files.read('/tmp/parsed_pitch.csv')

            # Write to local output
            output_path = os.path.join(os.getcwd(), 'parsed_pitch.csv')
            # Handle both bytes and string response
            if isinstance(csv_content, bytes):
                with open(output_path, 'wb') as f:
                    f.write(csv_content)
            else:
                with open(output_path, 'w', encoding='utf-8') as f:
                    f.write(csv_content)

            logger.info(f"Result saved to: {output_path}")
            logger.info("=" * 60)
            logger.info("Pipeline completed successfully!")
            logger.info("=" * 60)

            return output_path

    except Exception as e:
        logger.error(f"Pipeline failed: {e}")
        raise


def main():
    """CLI entry point."""
    # Get configuration from environment
    pdf_path = os.getenv('PDF_PATH', 'pitch.pdf')
    groq_api_key = os.getenv('GROQ_API_KEY')
    e2b_api_key = os.getenv('E2B_API_KEY')  # Optional if already configured

    if not groq_api_key:
        logger.error("GROQ_API_KEY environment variable not set")
        raise ValueError("GROQ_API_KEY is required")

    result_path = run_pitch_parser(pdf_path, groq_api_key, e2b_api_key)
    logger.info(f"Results available at: {result_path}")


if __name__ == "__main__":
    main()
