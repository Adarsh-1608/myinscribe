# MyInscribe AI-Based Content Workflow Automation Project
## Content Craft

This repository contains a content generation and optimization application using various AI models and tools. Follow the instructions below to set up and run the application.

# Table of Contents:
1. Prerequisites
2. Setup Instructions
    - Cloning the Repository
    - Creating a Virtual Environment
    - Installing Dependencies
    - Downloading AI Models
3. Running the Application
4. Updating Model Path
5. Usage
# Prerequisites:
  - Python 3.8 or higher
  - Git
  - pip
# Setup Instructions:
## Cloning the Repository:
First, clone the repository to your local machine:<br/>
    
    git clone https://github.com/Adarsh-1608/myinscribe.git 
     
     cd myinscribe/backend
    
## Creating a Virtual Environment
Create and activate a virtual environment:  
- For Windows  
python -m venv env  
env\Scripts\activate

- For macOS/Linux  
python3 -m venv env  
source env/bin/activate

## Installing Dependencies
Install the required packages from requirements.txt:  
pip install -r requirements.txt  

## Downloading AI Models
Some AI models need to be downloaded and placed in the correct directories. Follow the instructions below to download the necessary models:

1. Llama Model: Download the Llama model llama-2-7b-chat.Q4_K_M.gguf and place it in the ./models/7B/ directory.

2. spaCy Model: Download the spaCy model by running:
   python -m spacy download en_core_web_sm

# Running the Application
Ensure your virtual environment is activated, then run the application:  
python run.py #start the backend server

# Updating Model Path
If the path to the Llama model changes, update it in backend/app/ai.py, line 11

# Run the frontend
Go to the myinscribe/frontend directory and run this command:  
npm start

# You are Ready!
