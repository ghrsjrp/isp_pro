
from fastapi import FastAPI, Request, Depends, Form, HTTPException, status
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
import models, database, auth
from database import engine, get_db
import json

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="ISP Consultant Pro")
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

@app.get("/", response_class=HTMLResponse)
async def dashboard(request: Request, db: Session = Depends(get_db)):
    user = request.cookies.get("auth_user")
    if not user: return RedirectResponse(url="/login")
    isps = db.query(models.ISP).all()
    return templates.TemplateResponse("index.html", {"request": request, "isps": isps, "user": user})

@app.get("/login", response_class=HTMLResponse)
async def login_page(request: Request): return templates.TemplateResponse("login.html", {"request": request})

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

@app.get("/isp/{isp_id}", response_class=HTMLResponse)
async def view_isp(isp_id: int, request: Request, db: Session = Depends(get_db)):
    user = request.cookies.get("auth_user")
    if not user: return RedirectResponse(url="/login")
    isp = db.query(models.ISP).filter(models.ISP.id == isp_id).first()
    if not isp: raise HTTPException(status_code=404)
    if not isp.core_services:
        new_core = models.CoreService(isp_id=isp.id, dns={}, ntp={}, tools={}, cgnat={})
        db.add(new_core)
        db.commit()
        db.refresh(isp)
    return templates.TemplateResponse("isp_view.html", {"request": request, "isp": isp, "user": user})

@app.post("/isp/save")
async def save_isp(
    id: int = Form(None), 
    name: str = Form(...), 
    cnpj: str = Form(None), 
    subscribers: int = Form(0), 
    erp: str = Form(None), 
    topology: str = Form(None),
    tech_contact: str = Form(None),
    has_asn: bool = Form(False), 
    has_ipv4: bool = Form(False), 
    has_ipv6: bool = Form(False), 
    db: Session = Depends(get_db)
):
    if id: isp = db.query(models.ISP).filter(models.ISP.id == id).first()
    else: isp = models.ISP()
    
    isp.name = name
    isp.cnpj = cnpj
    isp.subscribers = subscribers
    isp.erp = erp
    isp.topology = topology
    isp.tech_contact = tech_contact
    isp.has_asn = has_asn
    isp.has_ipv4 = has_ipv4
    isp.has_ipv6 = has_ipv6
    
    if not id: db.add(isp)
    db.commit()
    return RedirectResponse(url=f"/isp/{isp.id}" if id else "/", status_code=status.HTTP_303_SEE_OTHER)

@app.post("/isp/{isp_id}/pop/save")
async def save_pop(isp_id: int, id: int = Form(None), name: str = Form(...), city_uf: str = Form(...), function: str = Form(...), address: str = Form(None), notes: str = Form(None), db: Session = Depends(get_db)):
    if id: pop = db.query(models.POP).filter(models.POP.id == id).first()
    else: pop = models.POP(isp_id=isp_id)
    pop.name, pop.city_uf, pop.function, pop.address, pop.notes = name, city_uf, function, address, notes
    if not id: db.add(pop)
    db.commit()
    return RedirectResponse(url=f"/isp/{isp_id}#pops", status_code=status.HTTP_303_SEE_OTHER)

@app.post("/isp/{isp_id}/router/save")
async def save_router(
    isp_id: int, id: int = Form(None), pop_id: int = Form(...), hostname: str = Form(...), 
    vendor: str = Form(...), model: str = Form(None), function: str = Form(...), 
    management_ip: str = Form(None), version: str = Form(None), 
    bgp_filters: bool = Form(True), antispoofing: bool = Form(True),
    backup: bool = Form(True), notes: str = Form(None), db: Session = Depends(get_db)
):
    if id: router = db.query(models.Router).filter(models.Router.id == id).first()
    else: router = models.Router(isp_id=isp_id)
    
    router.pop_id = pop_id
    router.hostname = hostname
    router.vendor = vendor
    router.model = model
    router.function = function
    router.management_ip = management_ip
    router.version = version
    router.bgp_filters = bgp_filters
    router.antispoofing = antispoofing
    router.backup = backup
    router.notes = notes
    
    if not id: db.add(router)
    db.commit()
    return RedirectResponse(url=f"/isp/{isp_id}#roteadores", status_code=status.HTTP_303_SEE_OTHER)

@app.post("/isp/{isp_id}/link/save")
async def save_link(
    isp_id: int, id: int = Form(None), pop_id: int = Form(...), link_type: str = Form(...), 
    provider: str = Form(...), capacity: str = Form(None), remote_asn: str = Form(None),
    ipv4_address: str = Form(None), ipv6_address: str = Form(None), interface: str = Form(None),
    is_bgp_active: bool = Form(False), is_backup: bool = Form(False), status: str = Form("Ativo"),
    sla: str = Form(None), notes: str = Form(None), db: Session = Depends(get_db)
):
    if id: link = db.query(models.Connectivity).filter(models.Connectivity.id == id).first()
    else: link = models.Connectivity(isp_id=isp_id)
    
    link.pop_id = pop_id
    link.link_type = link_type
    link.provider = provider
    link.capacity = capacity
    link.remote_asn = remote_asn
    link.ipv4_address = ipv4_address
    link.ipv6_address = ipv6_address
    link.interface = interface
    link.is_bgp_active = is_bgp_active
    link.is_backup = is_backup
    link.status = status
    link.sla = sla
    link.notes = notes
    
    if not id: db.add(link)
    db.commit()
    return RedirectResponse(url=f"/isp/{isp_id}#conectividade", status_code=status.HTTP_303_SEE_OTHER)

@app.post("/isp/{isp_id}/switch/save")
async def save_switch(
    isp_id: int, id: int = Form(None), pop_id: int = Form(...), hostname: str = Form(...),
    vendor: str = Form(...), model: str = Form(None), version: str = Form(None),
    lldp: bool = Form(True), stp: bool = Form(True), backup: bool = Form(True),
    capabilities: str = Form("[]"), notes: str = Form(None), db: Session = Depends(get_db)
):
    if id: sw = db.query(models.Switch).filter(models.Switch.id == id).first()
    else: sw = models.Switch(isp_id=isp_id)
    
    sw.pop_id = pop_id
    sw.hostname = hostname
    sw.vendor = vendor
    sw.model = model
    sw.version = version
    sw.lldp = lldp
    sw.stp = stp
    sw.backup = backup
    sw.notes = notes
    try:
        sw.capabilities = json.loads(capabilities)
    except:
        sw.capabilities = []
        
    if not id: db.add(sw)
    db.commit()
    return RedirectResponse(url=f"/isp/{isp_id}#switches", status_code=status.HTTP_303_SEE_OTHER)

@app.post("/isp/{isp_id}/olt/save")
async def save_olt(
    isp_id: int, id: int = Form(None), pop_id: int = Form(...), hostname: str = Form(...),
    vendor: str = Form(...), model: str = Form(None), version: str = Form(None),
    pon_ports: int = Form(0), subscribers: int = Form(0), unlocked: bool = Form(True),
    backup: bool = Form(True), notes: str = Form(None), db: Session = Depends(get_db)
):
    if id: olt = db.query(models.OLT).filter(models.OLT.id == id).first()
    else: olt = models.OLT(isp_id=isp_id)
    
    olt.pop_id = pop_id
    olt.hostname = hostname
    olt.vendor = vendor
    olt.model = model
    olt.version = version
    olt.pon_ports = pon_ports
    olt.subscribers = subscribers
    olt.unlocked = unlocked
    olt.backup = backup
    olt.notes = notes
    
    if not id: db.add(olt)
    db.commit()
    return RedirectResponse(url=f"/isp/{isp_id}#olts", status_code=status.HTTP_303_SEE_OTHER)

@app.post("/isp/{isp_id}/services/save")
async def save_services(
    isp_id: int, 
    dns_json: str = Form("{}"),
    ntp_json: str = Form("{}"),
    tools_json: str = Form("{}"),
    cgnat_json: str = Form("{}"),
    db: Session = Depends(get_db)
):
    isp = db.query(models.ISP).filter(models.ISP.id == isp_id).first()
    s = isp.core_services
    try:
        s.dns = json.loads(dns_json)
        s.ntp = json.loads(ntp_json)
        s.tools = json.loads(tools_json)
        s.cgnat = json.loads(cgnat_json)
    except:
        pass
    db.commit()
    return RedirectResponse(url=f"/isp/{isp_id}#servicos", status_code=status.HTTP_303_SEE_OTHER)
