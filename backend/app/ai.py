from transformers import pipeline
import spacy
from textstat import textstat
from collections import Counter
import re
import language_tool_python
import os
from groq import Groq
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize Groq client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# Load spaCy model
nlp = spacy.load("en_core_web_sm")

# Initialize transformers pipeline for summarization
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

# Initialize LanguageTool
tool = language_tool_python.LanguageTool('en-US')

def generate_content(prompt, max_tokens=512, model="llama3-8b-8192"):
    try:
        # Create chat completion request
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model=model,
        )
        # Extract the content from the response
        response_text = chat_completion.choices[0].message.content
        return response_text.strip()
    except Exception as e:
        print(f"Error generating content: {e}")
        return None

def optimize_content(text):
    summary = summarizer(text, max_length=150, min_length=50, do_sample=False)
    return summary[0]['summary_text']

def analyze_content(text):
    doc = nlp(text)
    entities = [(ent.text, ent.label_) for ent in doc.ents]
    return {"entities": entities}

def get_readability_score(text):
    return textstat.flesch_reading_ease(text)

def keyword_density_analysis(text):
    words = re.findall(r'\b\w+\b', text.lower())
    total_words = len(words)
    keyword_counts = Counter(words)
    keyword_density = {word: count / total_words * 100 for word, count in keyword_counts.items()}
    return keyword_density

def grammar_and_spelling_check(text):
    matches = tool.check(text)
    corrections = [{'message': match.message, 'corrections': match.replacements} for match in matches]
    return corrections
