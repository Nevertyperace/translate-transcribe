from fastapi import FastAPI, Depends, HTTPException, status, Security
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from passlib.context import CryptContext
import jwt
from datetime import datetime, timedelta
from models import User, Base
from schemas import UserCreate, UserRead, PasswordUpdateRequest, EmailUpdateRequest

SQLALCHEMY_DATABASE_URL = "postgresql://user:password@postgres/awct_db"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base.metadata.create_all(bind=engine)

app = FastAPI()

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
    allow_headers=["*"]
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def authenticate_user(db: Session, username: str, password: str):
    user = db.query(User).filter(User.username == username).first()
    if user and pwd_context.verify(password, user.hashed_password):
        return user
    return None

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, "SECRET_KEY", algorithm="HS256")
    return encoded_jwt

@app.post("/token")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=15)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/register")
async def register_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    hashed_password = pwd_context.hash(user.password)
    new_user = User(username=user.username, email=user.email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    return {"message": "User registered successfully"}

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, "SECRET_KEY", algorithms=["HS256"])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=400, detail="Invalid authentication credentials")
        return username
    except jwt.PyJWTError:
        raise HTTPException(status_code=400, detail="Invalid authentication credentials")

@app.delete("/users/{username}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(username: str, db: Session = Depends(get_db), current_user: str = Security(get_current_user)):
    if current_user != username:
        raise HTTPException(status_code=403, detail="Not authorized to delete this user")
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}

@app.get("/user-info", response_model=UserRead)
async def get_user_info(current_user: str = Security(get_current_user), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == current_user).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.post("/update-password")
async def update_password(request: PasswordUpdateRequest, db: Session = Depends(get_db), current_user: str = Security(get_current_user)):
    user = db.query(User).filter(User.username == current_user).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if not pwd_context.verify(request.old_password, user.hashed_password):
        raise HTTPException(status_code=403, detail="Incorrect current password")
    
    user.hashed_password = pwd_context.hash(request.new_password)
    db.commit()
    return {"message": "Password updated successfully"}

@app.post("/update-email")
async def update_email(request: EmailUpdateRequest, db: Session = Depends(get_db), current_user: str = Security(get_current_user)):
    user = db.query(User).filter(User.username == current_user).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    existing_user = db.query(User).filter(User.email == request.new_email).first()
    if existing_user and existing_user.username != current_user:
        raise HTTPException(status_code=400, detail="Email is already in use")
    
    user.email = request.new_email
    db.commit()
    return {"message": "Email updated successfully"}