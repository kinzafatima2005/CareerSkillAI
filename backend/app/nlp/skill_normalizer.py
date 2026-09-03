"""
Skill Normalizer for CareerSkill AI
"""

from backend.app.nlp.skill_taxonomy import ALIAS_TO_CANONICAL, SKILL_TAXONOMY


def normalize_skill(raw_skill: str) -> str:
    """
    Normalizes a raw skill string or alias into its canonical skill name.
    If unknown, returns Title Case of the stripped string.
    """
    if not raw_skill or not isinstance(raw_skill, str):
        return ""

    cleaned = raw_skill.strip().lower()
    
    # Direct lookup in alias dictionary
    if cleaned in ALIAS_TO_CANONICAL:
        return ALIAS_TO_CANONICAL[cleaned]

    # Partial substring checks for edge cases
    if "pytorch" in cleaned:
        return "PyTorch"
    if "tensorflow" in cleaned:
        return "TensorFlow"
    if "amazon web services" in cleaned or "aws" in cleaned:
        return "AWS"
    if "scikit" in cleaned or "sklearn" in cleaned:
        return "Scikit-Learn"
    if "large language model" in cleaned or "llm" in cleaned:
        return "LLMs"
    if "retrieval" in cleaned and "generation" in cleaned:
        return "RAG"
    if "generative ai" in cleaned or "genai" in cleaned:
        return "Generative AI"

    # Default fallback: Title Case
    return raw_skill.strip().title()


def get_skill_category(canonical_skill: str) -> str:
    """Returns the domain category for a canonical skill."""
    if canonical_skill in SKILL_TAXONOMY:
        return SKILL_TAXONOMY[canonical_skill]["category"]
    return "General Tech"
