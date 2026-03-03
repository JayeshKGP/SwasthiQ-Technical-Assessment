from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date
from . import models, schemas

def compute_status(quantity: int, min_stock_level: int, expiry_date: date) -> str:
    if expiry_date < date.today():
        return "Expired"
    if quantity == 0:
        return "Out of Stock"
    if quantity <= min_stock_level:
        return "Low Stock"
    return "Active"

def get_medicines(db: Session, search: str = None, status: str = None):
    query = db.query(models.Medicine)
    if search:
        query = query.filter(models.Medicine.name.ilike(f"%{search}%"))
    if status:
        query = query.filter(models.Medicine.status == status)
    return query.all()

def get_medicine(db: Session, medicine_id: int):
    return db.query(models.Medicine).filter(models.Medicine.id == medicine_id).first()

def create_medicine(db: Session, data: schemas.MedicineCreate):
    status = compute_status(data.quantity, data.min_stock_level, data.expiry_date)
    medicine = models.Medicine(**data.model_dump(), status=status)
    db.add(medicine)
    db.commit()
    db.refresh(medicine)
    return medicine

def update_medicine(db: Session, medicine_id: int, data: schemas.MedicineUpdate):
    medicine = get_medicine(db, medicine_id)
    if not medicine:
        return None
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(medicine, key, value)
    medicine.status = compute_status(medicine.quantity, medicine.min_stock_level, medicine.expiry_date)
    db.commit()
    db.refresh(medicine)
    return medicine

def update_medicine_status(db: Session, medicine_id: int, data: schemas.MedicineStatusUpdate):
    medicine = get_medicine(db, medicine_id)
    if not medicine:
        return None
    medicine.status = data.status
    db.commit()
    db.refresh(medicine)
    return medicine

def get_sales_summary(db: Session):
    today = date.today()
    result = db.query(
        func.coalesce(func.sum(models.Sale.total_amount), 0),
        func.coalesce(func.sum(models.Sale.quantity_sold), 0)
    ).filter(func.date(models.Sale.sold_at) == today.isoformat()).first()
    return {"total_sales_today": result[0], "total_items_sold_today": result[1]}

def get_low_stock_items(db: Session):
    return db.query(models.Medicine).filter(models.Medicine.status == "Low Stock").all()

def get_purchase_orders(db: Session):
    orders = db.query(models.PurchaseOrder, models.Medicine.name).join(
        models.Medicine, models.PurchaseOrder.medicine_id == models.Medicine.id
    ).all()
    result = []
    for order, medicine_name in orders:
        result.append({
            "id": order.id,
            "medicine_id": order.medicine_id,
            "medicine_name": medicine_name,
            "quantity_ordered": order.quantity_ordered,
            "total_cost": order.total_cost,
            "supplier": order.supplier,
            "ordered_at": order.ordered_at,
        })
    return result

def get_recent_sales(db: Session, limit: int = 10):
    rows = db.query(models.Sale, models.Medicine.name).join(
        models.Medicine, models.Sale.medicine_id == models.Medicine.id
    ).order_by(models.Sale.sold_at.desc()).limit(limit).all()
    result = []
    for sale, medicine_name in rows:
        result.append({
            "id": sale.id,
            "medicine_id": sale.medicine_id,
            "medicine_name": medicine_name,
            "quantity_sold": sale.quantity_sold,
            "total_amount": sale.total_amount,
            "sold_at": sale.sold_at,
        })
    return result
