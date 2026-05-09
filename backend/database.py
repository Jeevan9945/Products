from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine

db_url = "sqlite:///./project.db"

engine = create_engine(
    db_url,
    connect_args={"check_same_thread": False}
)

session = sessionmaker(
    autoflush=False,
    bind=engine
)
