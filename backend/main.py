from dotenv import load_dotenv
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser


load_dotenv(r"C:\Rajnish-chatbox\backend\.env")

api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    raise ValueError("GOOGLE_API_KEY not found")


app = FastAPI(
    title="Rajnish AI Chatbot",
    description="LangChain Gemini Chatbot API"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


model = ChatGoogleGenerativeAI(
    model="gemini-3.8-flash",
    google_api_key=api_key
)


prompt = ChatPromptTemplate.from_messages([
    (
        "system",
        """You are a helpful AI assistant.

User name: {name}
Response language: {language}
Answer style: {style}

Rules:
- Give clear and accurate answers.
- Use simple language.
- Explain technical concepts with examples.
- If the user asks a coding question, provide working code.
"""
    ),
    (
        "human",
        "{input}"
    )
])


parser = StrOutputParser()

chain = prompt | model | parser


class ChatRequest(BaseModel):
    name: str
    language: str
    style: str
    input: str


class ChatResponse(BaseModel):
    response: str


@app.get("/")
def home():
    return {
        "message": "Rajnish AI Chatbot API is running"
    }


@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):

    response = chain.invoke({
        "name": request.name,
        "language": request.language,
        "style": request.style,
        "input": request.input
    })

    return {
        "response": response
    }
