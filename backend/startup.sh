#!/bin/bash
python3 -m venv worker_env
source worker_env/bin/activate
pip install -r requirements.txt
python run.py

