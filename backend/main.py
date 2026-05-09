from fastapi import Depends, FastAPI
from pydantic import BaseModel
from database import session,engine
import datamodel
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware



datamodel.Base.metadata.create_all(bind=engine)
app=FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
def greet():
    return "Hello World"
class products(BaseModel):
    id:int
    name:str
    descrption:str
    quantity:int
    price:float
Products=[
    products(id=1,name="Phone",descrption="Smart Phone",quantity=50,price=123),
    products(id=2,name="Laptop",descrption="Smart Speed ",quantity=50,price=123),
    products(id=6,name="TV",descrption="Smart TV",quantity=50,price=123),
    ]

def get_db():
    db=session()
    try:
        yield db
    finally:
        db.close()    

def init_db():
    db=session()
    count=db.query(datamodel.products).count()

    if count==0:
      for product in Products:
          db.add(datamodel.products(**product.model_dump()))
      db.commit()
init_db()        

@app.get("/product")    
def product_list(db:Session = Depends(get_db)):
    db_list=db.query(datamodel.products).all()

    
    return db_list



#For take Id wise Product Details
@app.get("/product/{id}")
def product_by_id(id:int,db:Session = Depends(get_db)):
    db_list=db.query(datamodel.products).filter(datamodel.products.id==id).first()
    if db_list:
        return db_list
    return "Product Not Found"

# Add Products To that Already Existed Product
@app.post("/product")
def add(product:products,db:Session = Depends(get_db)):
    db.add(datamodel.products(**product.model_dump()))
    db.commit()
  
    return product

#Update A Product List [PUT]
@app.put("/product")
def update(id:int,product:products,db:Session = Depends(get_db)):
    db_list=db.query(datamodel.products).filter(datamodel.products.id==id).first()
    if db_list:
        db_list.name=product.name
        db_list.descrption=product.descrption
        db_list.quantity=product.quantity
        db_list.price=product.price
        db.commit()
        return "Updated Sucessfully"
    else:
        return "Not Found"

#Delete The Product [delete]
@app.delete("/product")
def delete(id:int,db:Session = Depends(get_db)):
    db_list=db.query(datamodel.products).filter(datamodel.products.id==id).first()
    if db_list:
        db.delete(db_list)
        db.commit()
        return "Deleted Sucessfully"
    else:
        return "not found"
