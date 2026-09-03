"""
Skill Co-occurrence Engine for CareerSkill AI
"""

import json
import pandas as pd
from typing import Dict, List, Any, Tuple
from collections import defaultdict


def calculate_skill_cooccurrence(df: pd.DataFrame, target_role: str = None, top_n: int = 15) -> List[Dict[str, Any]]:
    """
    Calculates pairwise skill co-occurrence frequencies and Jaccard similarities.
    """
    if df.empty:
        return []

    role_df = df if not target_role else df[df["normalized_title"].str.lower() == target_role.lower()]
    if role_df.empty:
        return []

    pair_counts: Dict[Tuple[str, str], int] = defaultdict(int)
    skill_counts: Dict[str, int] = defaultdict(int)

    for _, row in role_df.iterrows():
        skills = sorted(list(set(json.loads(row["extracted_skills"]) if isinstance(row["extracted_skills"], str) else row["extracted_skills"])))
        for s in skills:
            skill_counts[s] += 1
        
        for i in range(len(skills)):
            for j in range(i + 1, len(skills)):
                pair = (skills[i], skills[j])
                pair_counts[pair] += 1

    results = []
    for (s1, s2), co_count in pair_counts.items():
        total_s1 = skill_counts[s1]
        total_s2 = skill_counts[s2]
        union_count = total_s1 + total_s2 - co_count
        jaccard = round(co_count / union_count, 2) if union_count > 0 else 0.0

        results.append({
            "skill_a": s1,
            "skill_b": s2,
            "cooccurrence_count": co_count,
            "jaccard_similarity": jaccard,
            "pair_label": f"{s1} ↔ {s2}"
        })

    results.sort(key=lambda x: x["cooccurrence_count"], reverse=True)
    return results[:top_n]
