import requests
import os

CHUNK_SIZE = 1024
url = "https://api.elevenlabs.io/v1/text-to-speech/MW0jbeKljDZKAdR2YoHV"

headers = {
  "Accept": "audio/mpeg",
  "Content-Type": "application/json",
  "xi-api-key": os.environ.get("XI_API_KEY")
}

def text_to_speech(prompt: str | None, filename: str):
    data = {
        "text": prompt,
        "model_id": "eleven_monolingual_v1",
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.5
        }
    }

    response = requests.post(url, json=data, headers=headers)

    if response.status_code == 200:
        file_path = os.path.join('audio_files', filename)

        with open(file_path, 'wb') as f:
            f.write(response.content)

        print(f"Audio content written to file: {file_path}\n")
        return file_path

    else:
        print("bad status code", response.status_code)
        return None
