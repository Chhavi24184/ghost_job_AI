import re

def clean_text(text):

    if not text:
        return ""

    # lowercase
    text = text.lower()

    # remove symbols
    text = re.sub(r'[^a-zA-Z ]', '', text)

    # remove extra spaces
    text = " ".join(text.split())

    return text