from supabase import create_client
from fastapi import FastAPI
import os

supabase_url = os.getenv("SUPABASE_URL") or ""
supabase_key = os.getenv("SUPABASE_KEY") or ""
supabase = create_client(supabase_url, supabase_key)