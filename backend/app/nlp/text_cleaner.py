import re
import html


def clean_text(text: str) -> str:
    """
    Cleans raw text (job descriptions or titles):
    - Unescapes HTML entities (&amp;, &lt;, etc.)
    - Removes HTML tags
    - Normalizes whitespace
    - Preserves standard tech skill syntax (C++, C#, .NET, Node.js, AI/ML)
    """
    if not text or not isinstance(text, str):
        return ""

    # Unescape HTML entities
    text = html.unescape(text)

    # Remove HTML tags
    text = re.sub(r"<[^>]+>", " ", text)

    # Remove non-printable / control characters except newlines/tabs
    text = re.sub(r"[\r\t\f\v]", " ", text)

    # Replace multiple whitespace/newlines with a single space
    text = re.sub(r"\s+", " ", text).strip()

    return text


def clean_company_name(company: str) -> str:
    """Standardizes company names for deduplication."""
    if not company or not isinstance(company, str):
        return "Unknown"
    company = clean_text(company)
    # Remove common suffixes like Inc., LLC, Corp, Ltd.
    company = re.sub(r"\b(Inc|LLC|Corp|Corporation|Ltd|Limited|Co)\b\.?", "", company, flags=re.IGNORECASE)
    return company.strip() or "Unknown"
