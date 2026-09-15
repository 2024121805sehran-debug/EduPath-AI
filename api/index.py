import os
import sys

# Ensure root directory and backend directory are in Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(current_dir)
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from backend.main import app

# Export app for Vercel Serverless Function handler
__all__ = ["app"]
