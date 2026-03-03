from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from ..database import get_db
from .. import crud, schemas

router = APIRouter(prefix="/inventory", tags=["inventory"])

@router.get("/")
def list_medicines(search: Optional[str] = None, status: Optional[str] = None, db: Session = Depends(get_db)):
    return crud.get_medicines(db, search=search, status=status)

@router.post("/", response_model=schemas.MedicineOut, status_code=201)
def add_medicine(data: schemas.MedicineCreate, db: Session = Depends(get_db)):
    return crud.create_medicine(db, data)

@router.put("/{medicine_id}", response_model=schemas.MedicineOut)
def update_medicine(medicine_id: int, data: schemas.MedicineUpdate, db: Session = Depends(get_db)):
    medicine = crud.update_medicine(db, medicine_id, data)
    if not medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")
    return medicine

@router.patch("/{medicine_id}/status", response_model=schemas.MedicineOut)
def update_status(medicine_id: int, data: schemas.MedicineStatusUpdate, db: Session = Depends(get_db)):
    medicine = crud.update_medicine_status(db, medicine_id, data)
    if not medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")
    return medicine
