from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine

db_url = "postgresql://postgres:Jeevanka%402007@localhost:5432/project" #in password @=%40
engine = create_engine(db_url)
session = sessionmaker(autoflush=False,bind=engine)
