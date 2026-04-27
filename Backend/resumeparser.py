import fitz

def extract_text_from_pdf(file_path):
    text = ""
    pdf = fitz.open(file_path)
    for page in pdf:
        text += page.get_text()
    return text

def extract_text_from_docx(file_path):
    # Try multiple ways to import the library
    try:
        import docx
        doc = docx.Document(file_path)
    except ImportError:
        try:
            from docx import Document
            doc = Document(file_path)
        except ImportError:
            raise ImportError("The 'python-docx' library is not detected. Please stop your server and run 'python -m pip install python-docx' then restart using 'python -m uvicorn main:app --host 0.0.0.0 --port 8000'.")
    
    text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
    return text

def extract_text_from_resume(file_path):
    """
    Auto-detect file type and extract text.
    Supports .pdf and .docx
    """
    fname = file_path.lower()
    if fname.endswith(".pdf"):
        return extract_text_from_pdf(file_path)
    elif fname.endswith(".docx"):
        return extract_text_from_docx(file_path)
    else:
        raise ValueError("Unsupported file format. Please upload PDF or DOCX.")
