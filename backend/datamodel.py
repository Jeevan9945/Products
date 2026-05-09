from sqlalchemy import Column,Integer,String,Float
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class products(Base):

    __tablename__="products"
    id=Column(Integer,primary_key=True,index=True)
    name=Column(String)
    descrption=Column(String)
    quantity=Column(Integer)
    price=Column(Float)