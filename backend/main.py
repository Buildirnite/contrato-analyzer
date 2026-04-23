import os
import io
import json
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from anthropic import AsyncAnthropic
import fitz
import docx

# 2. Cargar ANTHROPIC_API_KEY desde .env
load_dotenv()

# Inicializar cliente asíncrono de Anthropic
api_key = os.getenv("ANTHROPIC_API_KEY")
if not api_key:
    raise RuntimeError("No se encontró ANTHROPIC_API_KEY en el archivo .env")

anthropic = AsyncAnthropic(api_key=api_key)

# 1. FastAPI app con CORS habilitado
app = FastAPI(title="Analizador de Contratos Chilenos API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Modelos Pydantic
class AnalyzeRequest(BaseModel):
    text: str

class ChatMessage(BaseModel):
    role: str  # "user" o "assistant"
    content: str

class ChatRequest(BaseModel):
    text: str
    message: str
    history: list[ChatMessage] = []

class AnalyzeResponse(BaseModel):
    summary: str
    clauses: list[str]
    alerts: list[str]
    questions: list[str]

# 6. GET /api/health
@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

# 4. POST /api/analyze
@app.post("/api/analyze", response_model=AnalyzeResponse)
async def analyze_contract(request: AnalyzeRequest):
    system_prompt = """Eres un asistente legal especializado en derecho chileno.
    Analizas contratos según el Código Civil chileno,
    Código del Trabajo y Ley del Consumidor 19.496.
    Responde SIEMPRE en español chileno.
    Cuando analices un contrato retorna un JSON con exactamente
    estas keys:
    - summary: resumen ejecutivo en 3-4 oraciones simples
    - clauses: array de strings con las cláusulas más importantes
    - alerts: array de strings con alertas de riesgo o cláusulas
      abusivas según normativa chilena. Prefija cada alerta con
      emoji 🚨
    - questions: array de strings con preguntas sugeridas para
      hacerle al abogado
    Retorna SOLO el JSON, sin explicaciones ni markdown."""

    try:
        response = await anthropic.messages.create(
            model="claude-sonnet-4-5",
            max_tokens=2048,
            system=system_prompt,
            messages=[
                {
                    "role": "user",
                    "content": f"Por favor, analiza el siguiente contrato y retorna estrictamente el JSON solicitado:\n\n{request.text}"
                }
            ]
        )

        response_text = response.content[0].text.strip()

        # Limpieza de seguridad por si Claude incluye bloques de markdown (ej: ```json ... ```)
        if response_text.startswith("```json"):
            response_text = response_text[7:-3].strip()
        elif response_text.startswith("```"):
            response_text = response_text[3:-3].strip()

        parsed_data = json.loads(response_text)
        return AnalyzeResponse(**parsed_data)

    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Error: Claude no retornó un JSON válido.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en la API de Anthropic: {str(e)}")

# 7. POST /api/upload
@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    filename = file.filename or ""
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""

    if ext not in ("pdf", "docx", "txt"):
        raise HTTPException(
            status_code=415,
            detail=f"Formato no soportado: .{ext}. Use PDF, DOCX o TXT."
        )

    contents = await file.read()

    try:
        if ext == "pdf":
            doc = fitz.open(stream=contents, filetype="pdf")
            text = "\n".join(page.get_text() for page in doc)
            doc.close()
        elif ext == "docx":
            document = docx.Document(io.BytesIO(contents))
            text = "\n".join(p.text for p in document.paragraphs)
        else:
            text = contents.decode("utf-8")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al procesar el archivo: {str(e)}")

    if not text.strip():
        raise HTTPException(status_code=422, detail="No se pudo extraer texto del archivo.")

    return {"text": text}


# 5. POST /api/chat
@app.post("/api/chat")
async def chat_contract(request: ChatRequest):
    system_prompt = """Eres un abogado experto en derecho chileno (Código Civil, Código del Trabajo, Ley del Consumidor 19.496).
    Responde dudas sobre el contrato proporcionado de forma clara y directa.
    Responde SIEMPRE en español chileno."""

    messages = []

    # Incluir el contrato como contexto en el primer mensaje de la conversación
    if not request.history:
        messages.append({
            "role": "user",
            "content": f"<contrato_contexto>\n{request.text}\n</contrato_contexto>\n\nPregunta sobre este contrato: {request.message}"
        })
    else:
        # Reconstruir el historial
        is_first_user_msg = True
        for msg in request.history:
            if is_first_user_msg and msg.role == "user":
                messages.append({
                    "role": "user",
                    "content": f"<contrato_contexto>\n{request.text}\n</contrato_contexto>\n\n{msg.content}"
                })
                is_first_user_msg = False
            else:
                messages.append({
                    "role": msg.role,
                    "content": msg.content
                })

        # Añadir el mensaje actual
        messages.append({
            "role": "user",
            "content": request.message
        })

    try:
        response = await anthropic.messages.create(
            model="claude-sonnet-4-5",
            max_tokens=1500,
            system=system_prompt,
            messages=messages
        )
        return {"response": response.content[0].text}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en la API de Anthropic: {str(e)}")
