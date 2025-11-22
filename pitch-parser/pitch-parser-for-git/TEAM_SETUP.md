# Team Setup Guide

## For Your Team Members

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo>
   cd "MCP Hackathon Team"
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and add the team's API keys (get from team lead)

### Testing with Sample PDFs

**Option 1: Use test_data directory**
```bash
# Place your test PDF in test_data/
cp your_pitch.pdf test_data/sample_pitch.pdf

# Run with default path
python example.py
```

**Option 2: Specify PDF path**
```bash
python example.py path/to/any/pitch.pdf
```

## Project Structure

```
MCP Hackathon Team/
├── pitch_parser_e2b.py      # Main pipeline code
├── example.py               # CLI test script
├── test_data/               # Sample PDFs for testing (gitignored)
├── outputs/                 # CSV results (gitignored)
├── .env                     # API keys (gitignored, NEVER commit)
├── .env.example             # Template for .env
└── requirements.txt         # Python dependencies
```

## For UI Integration

When your teammate integrates this with the UI, they should:

### 1. Import the main function
```python
from pitch_parser_e2b import run_pitch_parser

# When UI receives a PDF upload
def handle_pdf_upload(uploaded_file):
    # Save uploaded file temporarily
    pdf_path = f"/tmp/{uploaded_file.name}"
    with open(pdf_path, 'wb') as f:
        f.write(uploaded_file.read())

    # Run parser
    result_path = run_pitch_parser(
        pdf_path=pdf_path,
        groq_api_key=os.getenv('GROQ_API_KEY'),
        e2b_api_key=os.getenv('E2B_API_KEY')
    )

    # Read and return results
    import csv
    with open(result_path, 'r') as f:
        reader = csv.DictReader(f)
        data = next(reader)

    return data  # Dictionary with extracted fields
```

### 2. Alternative: Direct bytes handling
```python
# If UI has PDF as bytes
import tempfile

def parse_pdf_bytes(pdf_bytes):
    # Write to temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp:
        tmp.write(pdf_bytes)
        tmp_path = tmp.name

    try:
        result = run_pitch_parser(
            pdf_path=tmp_path,
            groq_api_key=os.getenv('GROQ_API_KEY'),
            e2b_api_key=os.getenv('E2B_API_KEY')
        )
        return result
    finally:
        os.unlink(tmp_path)  # Clean up
```

## API Keys Management

**IMPORTANT:** Never commit API keys to git!

- `.env` is gitignored
- Each team member needs their own `.env` file
- Production deployment should use environment variables or secrets manager

## Testing Checklist

- [ ] Dependencies installed
- [ ] `.env` file created with valid API keys
- [ ] Test PDF placed in `test_data/` directory
- [ ] Run `python example.py` successfully
- [ ] Check `parsed_pitch.csv` output
- [ ] Verify all extracted fields look correct

## Troubleshooting

**"Module not found" errors:**
```bash
pip install -r requirements.txt
```

**"API key not found":**
- Check `.env` file exists
- Verify keys are correct (no extra spaces)
- Make sure `.env` is in the project root

**E2B sandbox errors:**
- Verify E2B API key is valid
- Check E2B dashboard for credit balance
- Ensure internet connectivity

## Contact

For pipeline integration questions, contact: [Your Name]
