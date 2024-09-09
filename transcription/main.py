from fastapi import FastAPI, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from audio_transcription_model import TranscriptionModel, Transcription
import shutil
import requests
from pathlib import Path
from tempfile import NamedTemporaryFile
from pydantic import BaseModel

app = FastAPI()

REDIS_DATA_URL = "http://data:8002"
DEFAULT_USER_ID = "default_user"

origins = [
    "http://localhost:8003",
    "http://localhost:8002",
    "http://localhost:8001",
    "http://localhost:8000",
    "http://localhost:3000",
    "http://0.0.0.0:8003",
    "http://0.0.0.0:8002",
    "http://0.0.0.0:8001",
    "http://0.0.0.0:8000",
    "http://0.0.0.0:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"])

model = TranscriptionModel()

# Transcribe and translate audio files
@app.post("/transcribe", response_model=Transcription)
async def transcribe(audio_file: UploadFile, translate: bool = Form(False)) -> Transcription:
    try:
        print("Received request to transcribe. Translate:", translate)
        tmp_path = save_upload_file_tmp(audio_file)
        transcription_result = model.api_transcribe(str(tmp_path), translate)

        if tmp_path.exists():
            tmp_path.unlink()

        payload = {
            "transcription": transcription_result['transcription'],
            "source_file": transcription_result['source_file'],
            "detected_language": transcription_result['detected_language'],
            "translation_time": transcription_result['translation_time']
        }

        response = requests.post(f'{REDIS_DATA_URL}/save/{DEFAULT_USER_ID}/transcriptions', json=payload)
        response.raise_for_status()

        return Transcription(**transcription_result)
    except Exception as e:
        print(f"Error during transcription: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

def save_upload_file_tmp(upload_file: UploadFile) -> Path:
    try:
        suffix = Path(upload_file.filename).suffix
        with NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            shutil.copyfileobj(upload_file.file, tmp)
            tmp_path = Path(tmp.name)
    finally:
        upload_file.file.close()
    return tmp_path

@app.get("/test")
def test_endpoint():
    return {"message": "Test successful"}
