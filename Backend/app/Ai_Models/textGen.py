import google.generativeai as genai

# Configure the API key
genai.configure(api_key="AIzaSyBsWIqoxTAR5J5y5wpXGqMJsQlDIZlyA4I")

# Function to generate text
def generate_text(prompt, num_facts=10):
    full_prompt = f"Provide {num_facts} biomedical facts, discoveries, or latest findings:\n\n"
    response = genai.GenerativeModel("gemini-1.5-flash").generate_content(full_prompt + prompt)
    facts = response.text.split("\n")  # Split into individual facts based on newline
    return [fact.strip() for fact in facts if fact.strip()]  # Clean and return as a list