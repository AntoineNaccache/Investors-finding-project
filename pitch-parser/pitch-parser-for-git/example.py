#!/usr/bin/env python3
"""
Example usage of the Pitch Deck Parser with E2B.
Usage:
    python example.py                          # Uses test_data/sample_pitch.pdf
    python example.py path/to/your/pitch.pdf   # Uses specified PDF
"""

from dotenv import load_dotenv
import os
import sys
from pitch_parser_e2b import run_pitch_parser

# Load environment variables from .env file
load_dotenv()


def main():
    """Run the pitch parser example."""

    # Get PDF path from command line or use default
    if len(sys.argv) > 1:
        pdf_path = sys.argv[1]
    else:
        pdf_path = os.path.join("test_data", "sample_pitch.pdf")

    # Get API keys from environment
    groq_api_key = os.getenv('GROQ_API_KEY')
    e2b_api_key = os.getenv('E2B_API_KEY')

    if not groq_api_key:
        print("Error: GROQ_API_KEY not found in environment")
        print("Please set it in your .env file or environment")
        return

    if not e2b_api_key:
        print("Warning: E2B_API_KEY not found in environment")
        print("Make sure you've configured it via 'e2b auth login' or set it in .env")

    print(f"Processing PDF: {pdf_path}")
    print("-" * 60)

    try:
        # Run the parser
        result_path = run_pitch_parser(
            pdf_path=pdf_path,
            groq_api_key=groq_api_key,
            e2b_api_key=e2b_api_key
        )

        print("\n" + "=" * 60)
        print(f"Success! Results saved to: {result_path}")
        print("=" * 60)

        # Optionally, read and display the results
        import csv
        with open(result_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                print("\nExtracted Data:")
                for key, value in row.items():
                    if value:
                        print(f"  {key}: {value}")

    except FileNotFoundError as e:
        print(f"Error: {e}")
        print("Please update the pdf_path variable to point to your PDF file")
    except Exception as e:
        print(f"Error during processing: {e}")


if __name__ == "__main__":
    main()
