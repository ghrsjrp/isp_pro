
from fastapi import FastAPI, Request, Depends, Form, HTTPException, status
from fastapi.responses import HTMLResponse, RedirectResponse, FileResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
import models, database, auth
from database import engine, get_db
import json
import os

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="ISP Consultant Pro")

# Monta o diretório raiz como estático para que o navegador encontre index.tsx, App.tsx, etc.
app.mount("/components", StaticFiles(directory="components"), name="components")
app.mount("/static", StaticFiles(directory="templates"), name="templates_static")

templates = Jinja2Templates(directory="templates")

@app.on_event("startup")
def startup_populate():
    db = database.SessionLocal()
    if not db.query(models.User).filter(models.User.username == "admin").first():
        hashed_pw = auth.get_password_hash("admin")
        user = models.User(username="admin", hashed_password=hashed_pw)
        db.add(user)
        db.commit()
    db.close()

# Rota para servir os arquivos .tsx e .ts individualmente para o ESM do navegador
@app.get("/{file_path:path}")
async def serve_source_files(file_path: str):
    if file_path.endswith((".tsx", ".ts", ".js")):
        if os.path.exists(file_path):
            # Define o content-type correto para módulos JS/TSX
            return FileResponse(file_path, media_type="application/javascript")
    
    # Se for a raiz, serve o index.html
    if file_path == "" or file_path == "/":
        return FileResponse("index.html")
    
    raise HTTPException(status_code=404)

@app.get("/api/dashboard", response_class=HTMLResponse)
async def dashboard_view(request: Request, db: Session = Depends(get_db)):
    user = request.cookies.get("auth_user")
    if not user: return RedirectResponse(url="/login")
    isps = db.query(models.ISP).all()
    return templates.TemplateResponse("index.html", {"request": request, "isps": isps, "user": user})

@app.get("/login", response_class=HTMLResponse)
async def login_page(request: Request): 
    return templates.TemplateResponse("login.html", {"request": request})

@app.post("/login")
async def login(username: str = Form(...), password: str = Form(...), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == username).first()
    if not user or not auth.verify_password(password, user.hashed_password):
        return RedirectResponse(url="/login?error=1", status_code=status.HTTP_303_SEE_OTHER)
    response = RedirectResponse(url="/", status_code=status.HTTP_303_SEE_OTHER)
    response.set_cookie(key="auth_user", value=username)
    return response

@app.get("/logout")
async def logout():
    response = RedirectResponse(url="/login")
    response.delete_cookie("auth_user")
    return response
