
from sqlalchemy import Column, Integer, String, Boolean, JSON, Text, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)

class ISP(Base):
    __tablename__ = "isps"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    cnpj = Column(String, unique=True)
    subscribers = Column(Integer, default=0)
    erp = Column(String)
    has_asn = Column(Boolean, default=False)
    has_ipv4 = Column(Boolean, default=False)
    has_ipv6 = Column(Boolean, default=False)
    topology = Column(Text)
    tech_contact = Column(String)
    services = Column(JSON, default=list)
    notes = Column(Text)
    
    pops = relationship("POP", back_populates="isp", cascade="all, delete-orphan")
    links = relationship("Connectivity", back_populates="isp", cascade="all, delete-orphan")
    routers = relationship("Router", back_populates="isp", cascade="all, delete-orphan")
    switches = relationship("Switch", back_populates="isp", cascade="all, delete-orphan")
    olts = relationship("OLT", back_populates="isp", cascade="all, delete-orphan")
    core_services = relationship("CoreService", back_populates="isp", uselist=False, cascade="all, delete-orphan")

class POP(Base):
    __tablename__ = "pops"
    id = Column(Integer, primary_key=True, index=True)
    isp_id = Column(Integer, ForeignKey("isps.id"))
    name = Column(String, nullable=False)
    city_uf = Column(String)
    function = Column(String)
    address = Column(String)
    notes = Column(Text)
    
    isp = relationship("ISP", back_populates="pops")
    links = relationship("Connectivity", back_populates="pop")
    routers = relationship("Router", back_populates="pop")
    switches = relationship("Switch", back_populates="pop")
    olts = relationship("OLT", back_populates="pop")

class Connectivity(Base):
    __tablename__ = "connectivity"
    id = Column(Integer, primary_key=True, index=True)
    isp_id = Column(Integer, ForeignKey("isps.id"))
    pop_id = Column(Integer, ForeignKey("pops.id"))
    link_type = Column(String) # Mapped from 'type' in frontend
    provider = Column(String, nullable=False)
    capacity = Column(String)
    remote_asn = Column(String)
    ipv4_address = Column(String)
    ipv6_address = Column(String)
    interface = Column(String) # Mapped from 'interface' in frontend
    is_bgp_active = Column(Boolean, default=False)
    is_backup = Column(Boolean, default=False)
    status = Column(String, default="Ativo")
    sla = Column(String)
    notes = Column(Text)

    isp = relationship("ISP", back_populates="links")
    pop = relationship("POP", back_populates="links")

class Router(Base):
    __tablename__ = "routers"
    id = Column(Integer, primary_key=True, index=True)
    isp_id = Column(Integer, ForeignKey("isps.id"))
    pop_id = Column(Integer, ForeignKey("pops.id"))
    hostname = Column(String, nullable=False)
    vendor = Column(String)
    model = Column(String)
    version = Column(String) # software_version
    function = Column(String) # role
    management_ip = Column(String)
    bgp_filters = Column(Boolean, default=True) # bgpFilters
    antispoofing = Column(Boolean, default=True) # BCP38
    backup = Column(Boolean, default=True)
    notes = Column(Text)

    isp = relationship("ISP", back_populates="routers")
    pop = relationship("POP", back_populates="routers")

class Switch(Base):
    __tablename__ = "switches"
    id = Column(Integer, primary_key=True, index=True)
    isp_id = Column(Integer, ForeignKey("isps.id"))
    pop_id = Column(Integer, ForeignKey("pops.id"))
    hostname = Column(String, nullable=False)
    vendor = Column(String)
    model = Column(String)
    version = Column(String)
    capabilities = Column(JSON, default=list)
    lldp = Column(Boolean, default=True)
    stp = Column(Boolean, default=True)
    backup = Column(Boolean, default=True)
    notes = Column(Text)

    isp = relationship("ISP", back_populates="switches")
    pop = relationship("POP", back_populates="switches")

class OLT(Base):
    __tablename__ = "olts"
    id = Column(Integer, primary_key=True, index=True)
    isp_id = Column(Integer, ForeignKey("isps.id"))
    pop_id = Column(Integer, ForeignKey("pops.id"))
    hostname = Column(String, nullable=False)
    vendor = Column(String)
    model = Column(String)
    version = Column(String)
    pon_ports = Column(Integer, default=0)
    subscribers = Column(Integer, default=0) # active_subs
    unlocked = Column(Boolean, default=True)
    backup = Column(Boolean, default=True)
    notes = Column(Text)

    isp = relationship("ISP", back_populates="olts")
    pop = relationship("POP", back_populates="olts")

class CoreService(Base):
    __tablename__ = "core_services"
    id = Column(Integer, primary_key=True, index=True)
    isp_id = Column(Integer, ForeignKey("isps.id"), unique=True)
    dns = Column(JSON, default=dict)
    ntp = Column(JSON, default=dict)
    tools = Column(JSON, default=dict)
    cgnat = Column(JSON, default=dict)
    isp = relationship("ISP", back_populates="core_services")
