"""
Learning Platform Resources Service
Maps canonical occupation skills to top-rated courses, certifications, and official documentation.
"""

from typing import Dict, List, Any

# Curated Learning Resources Registry
SKILL_LEARNING_RESOURCES: Dict[str, List[Dict[str, str]]] = {
    "Python": [
        {
            "platform": "Coursera",
            "title": "Python for Everybody Specialization (University of Michigan)",
            "url": "https://www.coursera.org/specializations/python",
            "type": "Course Specialization"
        },
        {
            "platform": "FreeCodeCamp",
            "title": "Scientific Computing with Python Certification",
            "url": "https://www.freecodecamp.org/learn/scientific-computing-with-python/",
            "type": "Certification"
        },
        {
            "platform": "Official Docs",
            "title": "Official Python Documentation & Tutorial",
            "url": "https://docs.python.org/3/tutorial/",
            "type": "Documentation"
        }
    ],
    "SQL": [
        {
            "platform": "Coursera",
            "title": "SQL for Data Science (UC Davis)",
            "url": "https://www.coursera.org/learn/sql-for-data-science",
            "type": "Course"
        },
        {
            "platform": "Udemy",
            "title": "The Complete SQL Bootcamp: Go from Zero to Hero",
            "url": "https://www.udemy.com/course/the-complete-sql-bootcamp/",
            "type": "Course"
        },
        {
            "platform": "FreeCodeCamp",
            "title": "Relational Database Certification (SQL & PostgreSQL)",
            "url": "https://www.freecodecamp.org/learn/relational-database/",
            "type": "Certification"
        }
    ],
    "Pandas": [
        {
            "platform": "Coursera",
            "title": "Applied Data Science with Python (Univ. of Michigan)",
            "url": "https://www.coursera.org/specializations/data-science-python",
            "type": "Course"
        },
        {
            "platform": "Official Docs",
            "title": "Pandas User Guide & Data Analysis Tutorials",
            "url": "https://pandas.pydata.org/docs/user_guide/index.html",
            "type": "Documentation"
        }
    ],
    "Scikit-Learn": [
        {
            "platform": "Coursera",
            "title": "Supervised Machine Learning: Regression and Classification (Andrew Ng)",
            "url": "https://www.coursera.org/learn/machine-learning",
            "type": "Course"
        },
        {
            "platform": "Official Docs",
            "title": "Scikit-Learn Getting Started Guide & API Reference",
            "url": "https://scikit-learn.org/stable/getting_started.html",
            "type": "Documentation"
        }
    ],
    "Machine Learning": [
        {
            "platform": "Coursera",
            "title": "Machine Learning Specialization (DeepLearning.AI & Stanford)",
            "url": "https://www.coursera.org/specializations/machine-learning-introduction",
            "type": "Specialization"
        },
        {
            "platform": "YouTube / FreeCodeCamp",
            "title": "Machine Learning Course for Beginners (Full 10-Hour Course)",
            "url": "https://www.youtube.com/watch?v=i_LwzRVP7bg",
            "type": "Video Course"
        }
    ],
    "Deep Learning": [
        {
            "platform": "Coursera",
            "title": "Deep Learning Specialization (DeepLearning.AI)",
            "url": "https://www.coursera.org/specializations/deep-learning",
            "type": "Specialization"
        },
        {
            "platform": "Udemy",
            "title": "Deep Learning A-Z™: Hands-On Artificial Neural Networks",
            "url": "https://www.udemy.com/course/deeplearning/",
            "type": "Course"
        }
    ],
    "PyTorch": [
        {
            "platform": "Coursera",
            "title": "Deep Learning with PyTorch (DeepLearning.AI)",
            "url": "https://www.coursera.org/learn/deep-neural-networks-with-pytorch",
            "type": "Course"
        },
        {
            "platform": "Official Docs",
            "title": "PyTorch Tutorials & Deep Learning Fundamentals",
            "url": "https://pytorch.org/tutorials/",
            "type": "Documentation"
        }
    ],
    "TensorFlow": [
        {
            "platform": "Coursera",
            "title": "DeepLearning.AI TensorFlow Developer Professional Certificate",
            "url": "https://www.coursera.org/professional-certificates/tensorflow-in-practice",
            "type": "Professional Certificate"
        },
        {
            "platform": "Official Docs",
            "title": "TensorFlow Core Tutorials",
            "url": "https://www.tensorflow.org/tutorials",
            "type": "Documentation"
        }
    ],
    "NLP": [
        {
            "platform": "Coursera",
            "title": "Natural Language Processing Specialization (DeepLearning.AI)",
            "url": "https://www.coursera.org/specializations/natural-language-processing",
            "type": "Specialization"
        },
        {
            "platform": "Hugging Face",
            "title": "Hugging Face NLP Course (Transformers & Tokenizers)",
            "url": "https://huggingface.co/learn/nlp-course/",
            "type": "Interactive Course"
        }
    ],
    "LLMs": [
        {
            "platform": "Coursera",
            "title": "Generative AI with Large Language Models (DeepLearning.AI & AWS)",
            "url": "https://www.coursera.org/learn/generative-ai-with-llms",
            "type": "Course"
        },
        {
            "platform": "DeepLearning.AI",
            "title": "Prompt Engineering & LLM Application Development Short Courses",
            "url": "https://www.deeplearning.ai/short-courses/",
            "type": "Short Course"
        }
    ],
    "RAG": [
        {
            "platform": "DeepLearning.AI",
            "title": "Building Applications with Vector Databases & LangChain",
            "url": "https://www.deeplearning.ai/short-courses/building-applications-with-vector-databases/",
            "type": "Short Course"
        },
        {
            "platform": "Official Docs",
            "title": "LlamaIndex & LangChain RAG Architecture Guides",
            "url": "https://python.langchain.com/docs/use_cases/question_answering/",
            "type": "Documentation"
        }
    ],
    "Generative AI": [
        {
            "platform": "Coursera",
            "title": "AI For Everyone & Generative AI Fundamentals (DeepLearning.AI)",
            "url": "https://www.coursera.org/learn/generative-ai-for-everyone",
            "type": "Course"
        }
    ],
    "FastAPI": [
        {
            "platform": "Official Docs",
            "title": "FastAPI Web Framework Official Tutorial & OpenAPI Specs",
            "url": "https://fastapi.tiangolo.com/tutorial/",
            "type": "Documentation"
        },
        {
            "platform": "FreeCodeCamp",
            "title": "FastAPI Course for Beginners - Build Python APIs",
            "url": "https://www.freecodecamp.org/news/fastapi-quickstart/",
            "type": "Tutorial"
        }
    ],
    "Docker": [
        {
            "platform": "Coursera",
            "title": "Docker for Developers & Containerization (Docker Inc.)",
            "url": "https://www.coursera.org/learn/docker-for-developers",
            "type": "Course"
        },
        {
            "platform": "FreeCodeCamp",
            "title": "Docker Tutorial for Beginners (Containerize Applications)",
            "url": "https://www.freecodecamp.org/news/docker-simplified/",
            "type": "Tutorial"
        }
    ],
    "AWS": [
        {
            "platform": "Coursera",
            "title": "AWS Cloud Practitioner & Machine Learning Specialization",
            "url": "https://www.coursera.org/specializations/aws-cloud-practitioner-essentials",
            "type": "Specialization"
        },
        {
            "platform": "AWS Training",
            "title": "Official AWS Skill Builder & Cloud Labs",
            "url": "https://explore.skillbuilder.aws/",
            "type": "Interactive Labs"
        }
    ],
    "Spark": [
        {
            "platform": "Coursera",
            "title": "Big Data Analysis with Scala and Spark (EPFL)",
            "url": "https://www.coursera.org/learn/scala-spark-big-data",
            "type": "Course"
        },
        {
            "platform": "Databricks Academy",
            "title": "Databricks & PySpark Data Engineering Fundamentals",
            "url": "https://www.databricks.com/learn/training/home",
            "type": "Certification"
        }
    ],
    "Tableau": [
        {
            "platform": "Coursera",
            "title": "Data Visualization with Tableau Specialization (UC Davis)",
            "url": "https://www.coursera.org/specializations/data-visualization",
            "type": "Specialization"
        }
    ],
    "Power BI": [
        {
            "platform": "Coursera",
            "title": "Microsoft Power BI Data Analyst Professional Certificate",
            "url": "https://www.coursera.org/professional-certificates/microsoft-power-bi-data-analyst",
            "type": "Professional Certificate"
        }
    ]
}


def get_learning_resources_for_skill(skill_name: str) -> List[Dict[str, str]]:
    """
    Returns curated learning resources for a given skill.
    Provides clean search fallback links if specific course mapping is missing.
    """
    if skill_name in SKILL_LEARNING_RESOURCES:
        return SKILL_LEARNING_RESOURCES[skill_name]
    
    # Clean fallback for any arbitrary skill
    encoded_skill = skill_name.replace(" ", "+")
    return [
        {
            "platform": "Coursera",
            "title": f"Search Top Coursera Courses for {skill_name}",
            "url": f"https://www.coursera.org/search?query={encoded_skill}",
            "type": "Course Search"
        },
        {
            "platform": "Udemy",
            "title": f"Explore {skill_name} Tutorials & Bootcamps on Udemy",
            "url": f"https://www.udemy.com/courses/search/?q={encoded_skill}",
            "type": "Course Search"
        },
        {
            "platform": "FreeCodeCamp",
            "title": f"FreeCodeCamp Guide & Tutorials for {skill_name}",
            "url": f"https://www.freecodecamp.org/news/search/?query={encoded_skill}",
            "type": "Tutorial"
        }
    ]
