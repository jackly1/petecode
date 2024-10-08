from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from .tts_martin import text_to_speech
from .baml_functions import get_answer
from supabase import create_client
from .problem_db import leetcode_problems
import re

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supabase client
supabase = create_client(os.getenv("SUPABASE_URL") or "", os.getenv("SUPABASE_KEY") or "")

# Directory to store audio files
AUDIO_DIR = 'audio_files'
if not os.path.exists(AUDIO_DIR):
    os.makedirs(AUDIO_DIR)

# Mount the audio directory to make files accessible
app.mount("/audio", StaticFiles(directory=AUDIO_DIR), name="audio")

# Pydantic models for request bodies
class UserCreate(BaseModel):
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class SubmitProblem(BaseModel):
    url: str
    user_id: str

class AudioGenerationRequest(BaseModel):
    url: str
    language: str

def extract_problem_name(url):
    pattern = r'https://leetcode\.com/problems/([-\w]+)/?'
    match = re.search(pattern, url)
    return match.group(1) if match else url

def get_problem_id_by_url(request_url):
    for problem in leetcode_problems:
        if problem["url"] == request_url:
            return problem["id"]
    return None

@app.post("/generate-audio/")
async def generate_audio(request: AudioGenerationRequest):
    try:
        problem_name = extract_problem_name(request.url)

        baml_groq_response = await get_answer(request.url, request.language)

        audio_files = []
        parts = [
            ("introduction", baml_groq_response.introduction),
            ("problem_description", baml_groq_response.problem_description),
            ("walk_through_solution", baml_groq_response.walk_through_solution)
        ]

        for part_name, part_text in parts:
            print(f"Processing {part_name}")
            new_file_name = f"{part_name}_{problem_name}_{request.language}.mp3"
            file_path = text_to_speech(part_text, new_file_name)
            print("Speech generated")
            if file_path:
                audio_files.append(f"/audio/{new_file_name}")
                print(f"Audio file created: {file_path}")
            else:
                raise HTTPException(status_code=500, detail=f"Failed to generate {part_name} audio file.")

        return {
            "message": "Audio files generated successfully",
            "url": request.url,
            "code": baml_groq_response.solution_in_code,
            "audio_files": audio_files,
            "status": 200
        }

    except Exception as e:
        print(f"Error in generate_audio: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/clear-audio/")
async def clear_audio(description: str, language: str):
    try:
        prefix = f"_{description[:10]}_{language}"
        for filename in os.listdir(AUDIO_DIR):
            if prefix in filename:
                os.remove(os.path.join(AUDIO_DIR, filename))
        return {"message": "Audio files cleared successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

