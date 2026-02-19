from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import aiosmtplib
from email.message import EmailMessage


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

class ContactMessage(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    service: str
    message: str

class ContactMessageDB(ContactMessage):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# Email configuration
SMTP_HOST = os.getenv('SMTP_HOST', 'smtp.gmail.com')
SMTP_PORT = int(os.getenv('SMTP_PORT', 587))
SMTP_USER = os.getenv('SMTP_USER', '')
SMTP_PASSWORD = os.getenv('SMTP_PASSWORD', '')
CONTACT_EMAIL = 's.fernandezabeledo@gmail.com'


async def send_contact_email(contact_data: ContactMessage):
    """Send contact form email"""
    try:
        message = EmailMessage()
        message["From"] = SMTP_USER or CONTACT_EMAIL
        message["To"] = CONTACT_EMAIL
        message["Subject"] = f"Nuevo mensaje de contacto de {contact_data.name}"
        
        email_body = f"""
Nuevo mensaje de contacto recibido:

Nombre: {contact_data.name}
Email: {contact_data.email}
Teléfono: {contact_data.phone or 'No proporcionado'}
Servicio de interés: {contact_data.service}

Mensaje:
{contact_data.message}

---
Este mensaje fue enviado desde el formulario de contacto de jesusaccesible.com
        """
        
        message.set_content(email_body)
        
        # If SMTP credentials are configured, send via SMTP
        if SMTP_USER and SMTP_PASSWORD:
            async with aiosmtplib.SMTP(hostname=SMTP_HOST, port=SMTP_PORT) as smtp:
                await smtp.login(SMTP_USER, SMTP_PASSWORD)
                await smtp.send_message(message)
                logging.info(f"Email sent successfully to {CONTACT_EMAIL}")
        else:
            # If no SMTP configured, just log the message
            logging.warning(f"SMTP not configured. Message would be sent to: {CONTACT_EMAIL}")
            logging.info(f"Contact message: {email_body}")
            
        return True
    except Exception as e:
        logging.error(f"Error sending email: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error sending email: {str(e)}")


# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

@api_router.post("/contact")
async def submit_contact_form(contact_data: ContactMessage):
    """Handle contact form submission"""
    try:
        # Save to database
        contact_db = ContactMessageDB(**contact_data.model_dump())
        
        # Convert to dict and serialize datetime to ISO string for MongoDB
        doc = contact_db.model_dump()
        doc['timestamp'] = doc['timestamp'].isoformat()
        
        await db.contact_messages.insert_one(doc)
        
        # Send email
        await send_contact_email(contact_data)
        
        return {
            "success": True,
            "message": "Mensaje enviado correctamente. Te contactaré pronto."
        }
    except Exception as e:
        logging.error(f"Error processing contact form: {str(e)}")
        raise HTTPException(status_code=500, detail="Error al enviar el mensaje")

@api_router.get("/download-cv")
async def download_cv():
    """Download CV PDF"""
    cv_path = ROOT_DIR / "static" / "CV_Jesus_Fernandez.pdf"
    if not cv_path.exists():
        raise HTTPException(status_code=404, detail="CV not found")
    
    return FileResponse(
        path=str(cv_path),
        media_type="application/pdf",
        filename="CV_Jesus_Fernandez_Abeledo.pdf"
    )

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()