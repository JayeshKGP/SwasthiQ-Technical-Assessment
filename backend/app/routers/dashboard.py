from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from .. import crud

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/sales-summary")
def sales_summary(db: Session = Depends(get_db)):
    return crud.get_sales_summary(db)

@router.get("/low-stock")
def low_stock(db: Session = Depends(get_db)):
    return crud.get_low_stock_items(db)

@router.get("/purchase-orders")
def purchase_orders(db: Session = Depends(get_db)):
    return crud.get_purchase_orders(db)

@router.get("/recent-sales")
def recent_sales(db: Session = Depends(get_db)):
    return crud.get_recent_sales(db)
