from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..db import supabase
from ..tts_martin import text_to_speech
import os

router = APIRouter()

class UserCreate(BaseModel):
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class SubmitProblem(BaseModel):
    url: str
    user_id: str

AUDIO_DIR = 'audio_files'
if not os.path.exists(AUDIO_DIR):
    os.makedirs(AUDIO_DIR)

@router.post("/register")
async def register(user: UserCreate):
    if not user.email or not user.password:
        raise HTTPException(status_code=400, detail="Email and password are required.")
    
    existing_user = supabase.table('users').select('*').eq('email', user.email).execute()
    if existing_user.data:
        raise HTTPException(status_code=400, detail="User already exists.")
    
    new_user = supabase.table('users').insert({'email': user.email, 'password': user.password}).execute()
    return {"message": "User registered successfully."}

@router.post("/login")
async def login(user: UserLogin):
    if not user.email or not user.password:
        raise HTTPException(status_code=400, detail="Email and password are required.")
    
    user_data = supabase.table('users').select('*').eq('email', user.email).eq('password', user.password).execute()
    if user_data.data:
        return {"message": "Login successful.", "user_id": user_data.data[0]['id']}
    else:
        raise HTTPException(status_code=401, detail="Invalid credentials.")

@router.post("/submit")
async def submit(problem: SubmitProblem):
    if not problem.url or not problem.user_id:
        raise HTTPException(status_code=400, detail="URL and user_id are required.")
    
    problem_id, description = get_problem_id(problem.url)
    if problem_id is None:
        raise HTTPException(status_code=404, detail="Problem not found for the given URL.")
    
    supabase.rpc('append_problem_to_user', {
        'user_id': problem.user_id,
        'problem_id': problem_id
    }).execute()
    
    audio_file_path = text_to_speech(description)
    
    return {
        "status": "success",
        "problem_id": problem_id,
        "description": description,
        "audio_file": audio_file_path
    }

def get_problem_id(url):
    response = supabase.table('problems').select('id', 'description').eq('url', url).execute()
    if response.data:
        return response.data[0]['id'], response.data[0]['description']
    return None, None