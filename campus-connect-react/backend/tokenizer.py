import spacy
import json

def tokenize_text(input_text):
    nlp = spacy.load('en_core_web_sm')
    doc = nlp(input_text)
    tokens = [token.text for token in doc]
    return tokens

if __name__ == "__main__":
    import sys
    input_text = sys.argv[1]
    tokens = tokenize_text(input_text)
    print(json.dumps(tokens))
