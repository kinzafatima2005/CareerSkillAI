"""
Skill Extractor Engine for CareerSkill AI
"""

import re
from typing import List, Set
from backend.app.nlp.skill_taxonomy import SKILL_TAXONOMY
from backend.app.nlp.skill_normalizer import normalize_skill


def extract_skills_from_text(text: str) -> List[str]:
    """
    Extracts canonical skills from a job description text string using pattern matching.
    Returns a sorted list of unique canonical skills found in the text.
    """
    if not text or not isinstance(text, str):
        return []

    text_lower = text.lower()
    found_skills: Set[str] = set()

    for canonical_skill, meta in SKILL_TAXONOMY.items():
        aliases = meta["aliases"]
        for alias in aliases:
            alias_lower = alias.lower()

            # Handle special token boundary edge cases (e.g. C++, C#, R, .NET)
            if alias_lower == "c++":
                pattern = r"(?:\b|[^a-zA-Z0-9])c\+\+(?:\b|[^a-zA-Z0-9])"
            elif alias_lower == "c#":
                pattern = r"(?:\b|[^a-zA-Z0-9])c\#(?:\b|[^a-zA-Z0-9])"
            elif alias_lower in ["r", "r-lang", "r language", "r programming"]:
                pattern = r"\b(r programming|r language|r-lang)\b|(?<=\b)r(?=\s+(?:programming|script|code|language|stats|data)\b)"
            elif len(alias_lower) <= 3 and not alias_lower.isalnum():
                pattern = r"(?:\b|[^a-zA-Z0-9])" + re.escape(alias_lower) + r"(?:\b|[^a-zA-Z0-9])"
            else:
                pattern = r"\b" + re.escape(alias_lower) + r"\b"

            if re.search(pattern, text_lower):
                found_skills.add(canonical_skill)
                break  # Skill matched, move to next canonical skill

    return sorted(list(found_skills))
