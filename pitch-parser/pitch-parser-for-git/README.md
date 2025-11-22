# Pitch Deck Parser Pipeline

A modular Python pipeline that extracts structured data from pitch deck PDFs using text extraction and the Groq Llama 3 API, running securely in E2B sandboxes.

## Features

- **E2B Sandbox Execution**: Runs in isolated, secure cloud sandboxes
- **Text Extraction**: Extracts text from PDF files (no OCR required)
- **AI-Powered Analysis**: Semantic field extraction using Groq Llama 3
- **Intelligent Aggregation**: Merges data across multiple slides
- **CSV Output**: Structured single-row results
- **Clean Architecture**: Modular, well-documented code

## Prerequisites

1. **E2B Account**: Sign up at [e2b.dev](https://e2b.dev) (includes $100 free credits)
2. **Groq Account**: Get API key at [console.groq.com](https://console.groq.com)

## Installation

```bash
pip install -r requirements.txt
```

## Configuration

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and add your API keys:

```bash
E2B_API_KEY=e2b_***
GROQ_API_KEY=gsk_***
```

## Usage

### Quick Start

```bash
python example.py
```

Update `example.py` to point to your PDF file.

### Programmatic Usage

```python
from pitch_parser_e2b import run_pitch_parser

result_path = run_pitch_parser(
    pdf_path="your_pitch_deck.pdf",
    groq_api_key="your_groq_key",
    e2b_api_key="your_e2b_key"  # Optional if configured via environment
)

print(f"Results saved to: {result_path}")
```

### Command Line

```bash
export GROQ_API_KEY="your_groq_key"
export E2B_API_KEY="your_e2b_key"
export PDF_PATH="path/to/pitch.pdf"

python pitch_parser_e2b.py
```

## Extracted Schema

The pipeline extracts the following fields:

| Field | Description | Aggregation Rule |
|-------|-------------|------------------|
| `company_sector` | Industry/sector | First non-empty |
| `company_location` | Geographic location | First non-empty |
| `business_model` | B2B, B2C, B2B2C, etc. | First non-empty |
| `maturity_stage` | Idea, POC, MVP, PMF, Scaling, Series A, etc. | First non-empty |
| `traction_ARR` | Annual Recurring Revenue | Latest non-empty |
| `traction_MRR` | Monthly Recurring Revenue | Latest non-empty |
| `traction_growth` | Growth metrics | Latest non-empty |
| `deal_ticket_size` | Individual investment ticket size | First non-empty |
| `deal_total_seeking` | Total amount the company is raising | First non-empty |
| `deal_valuation` | Company valuation | First non-empty |
| `deal_instrument` | SAFE or Priced Round | First non-empty |

## Pipeline Architecture

### 1. `parse_pdf(pdf_path)`
Extracts text from each PDF page using pdfplumber. Skips empty pages.

### 2. `clean_text(slide_text)`
Normalizes whitespace and removes common repeated headers/footers.

### 3. `extract_slide_fields(slide_text, groq_api_key)`
Calls Groq Llama 3 API with temperature=0 to extract structured fields from slide text.

### 4. `aggregate_results(list_of_dicts)`
Aggregates results from all slides using defined rules:
- Company info: first non-empty value
- Traction metrics: latest non-empty value
- Deal terms: first non-empty value

### 5. `write_csv(final_json, output_path)`
Writes final aggregated data to a single-row CSV file.

## Error Handling

- Comprehensive logging at each step
- Graceful handling of API failures
- Empty field defaults for missing data
- JSON parsing with fallback for malformed responses

## How It Works with E2B

The pipeline orchestrates PDF parsing in secure E2B sandboxes:

1. **Sandbox Creation**: Creates an isolated E2B sandbox environment
2. **Dependency Installation**: Installs `pdfplumber` and `requests` via pip
3. **File Upload**: Uploads your PDF to the sandbox filesystem
4. **Code Execution**: Runs the parsing pipeline inside the sandbox
5. **Result Download**: Retrieves the generated CSV to your local machine

### Why E2B?

- **Security**: Code runs in isolated sandboxes, protecting your system
- **Consistency**: Clean environment for every execution
- **Scalability**: Cloud-based infrastructure handles resource-intensive tasks
- **No Local Dependencies**: PDF processing happens remotely

## Limitations

- Text extraction only (no OCR for scanned PDFs)
- No chart or graph analysis
- Requires clean, text-based PDF files

## Example Output

```csv
company_sector,company_location,business_model,maturity_stage,traction_ARR,traction_MRR,traction_growth,deal_ticket_size,deal_total_seeking,deal_valuation,deal_instrument
"FinTech","San Francisco, CA","B2B","Series A","$2M","$180K","40% MoM","$100K-$500K","$5M","$20M","Priced Round"
```

## Logging

The pipeline provides detailed logging at each step:
- PDF parsing progress
- Text cleaning operations
- API calls and responses
- Aggregation decisions
- CSV writing confirmation

## License

MIT
