# Integration Guide

This directory contains the pitch deck parser pipeline for extracting structured data from PDF pitch decks.

## Quick Integration

This parser runs independently and can be integrated with the main project's backend or UI.

### API Integration Example

```python
from pitch_parser_e2b import run_pitch_parser
import os

def parse_uploaded_pitch(pdf_file_path):
    """
    Parse an uploaded pitch deck PDF.

    Args:
        pdf_file_path: Path to uploaded PDF

    Returns:
        Path to generated CSV file
    """
    result_path = run_pitch_parser(
        pdf_path=pdf_file_path,
        groq_api_key=os.getenv('GROQ_API_KEY'),
        e2b_api_key=os.getenv('E2B_API_KEY')
    )

    # Read CSV and return as dict
    import csv
    with open(result_path, 'r') as f:
        reader = csv.DictReader(f)
        return next(reader)
```

### Backend Integration

If integrating with the backend, you can:

1. Add an API endpoint that accepts PDF uploads
2. Call `run_pitch_parser()` with the uploaded file
3. Return the parsed data as JSON
4. Store results in your database

### Environment Variables

Add to your main `.env`:
```bash
E2B_API_KEY=e2b_***
GROQ_API_KEY=gsk_***
```

## Standalone Usage

See `TEAM_SETUP.md` for standalone testing and development.

## Extracted Fields

The parser extracts 11 structured fields:

### Company Info
- `company_sector` - Industry/sector
- `company_location` - Geographic location
- `business_model` - B2B, B2C, B2B2C, etc.
- `maturity_stage` - Idea, POC, MVP, PMF, Scaling, Series A, etc.

### Traction Metrics
- `traction_ARR` - Annual Recurring Revenue
- `traction_MRR` - Monthly Recurring Revenue
- `traction_growth` - Growth multipliers (150x, 1000x, etc.)

### Deal Terms
- `deal_ticket_size` - Individual investment ticket size
- `deal_total_seeking` - Total amount raising
- `deal_valuation` - Company valuation
- `deal_instrument` - SAFE or Priced Round

## Output Format

Single-row CSV file with all extracted fields.

Example:
```csv
company_sector,company_location,business_model,traction_ARR,deal_total_seeking,deal_instrument
Healthcare,France,B2B,180k,$3m,Priced Round
```
