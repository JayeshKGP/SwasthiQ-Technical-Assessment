from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional

class MedicineCreate(BaseModel):
    name: str
    category: str
    manufacturer: str
    batch_number: str
    quantity: int
    min_stock_level: int = 10
    price: float
    cost_price: float
    expiry_date: date

class MedicineUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    manufacturer: Optional[str] = None
    batch_number: Optional[str] = None
    quantity: Optional[int] = None
    min_stock_level: Optional[int] = None
    price: Optional[float] = None
    cost_price: Optional[float] = None
    expiry_date: Optional[date] = None

class MedicineStatusUpdate(BaseModel):
    status: str

class MedicineOut(BaseModel):
    id: int
    name: str
    category: str
    manufacturer: str
    batch_number: str
    quantity: int
    min_stock_level: int
    price: float
    cost_price: float
    expiry_date: date
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class SaleOut(BaseModel):
    id: int
    medicine_id: int
    medicine_name: str
    quantity_sold: int
    total_amount: float
    sold_at: datetime

class PurchaseOrderOut(BaseModel):
    id: int
    medicine_id: int
    medicine_name: str
    quantity_ordered: int
    total_cost: float
    supplier: str
    ordered_at: datetime

class DashboardSummary(BaseModel):
    total_sales_today: float
    total_items_sold_today: int
    low_stock_count: int
    pending_purchase_orders: int
