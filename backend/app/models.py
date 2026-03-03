from sqlalchemy import Column, Integer, String, Float, Date, DateTime, ForeignKey
from sqlalchemy.sql import func
from .database import Base

class Medicine(Base):
    __tablename__ = "medicines"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    manufacturer = Column(String, nullable=False)
    batch_number = Column(String, nullable=False)
    quantity = Column(Integer, nullable=False, default=0)
    min_stock_level = Column(Integer, nullable=False, default=10)
    price = Column(Float, nullable=False)
    cost_price = Column(Float, nullable=False)
    expiry_date = Column(Date, nullable=False)
    status = Column(String, nullable=False, default="Active")
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())


class Sale(Base):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, autoincrement=True)
    medicine_id = Column(Integer, ForeignKey("medicines.id"), nullable=False)
    quantity_sold = Column(Integer, nullable=False)
    total_amount = Column(Float, nullable=False)
    sold_at = Column(DateTime, server_default=func.now())


class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"

    id = Column(Integer, primary_key=True, autoincrement=True)
    medicine_id = Column(Integer, ForeignKey("medicines.id"), nullable=False)
    quantity_ordered = Column(Integer, nullable=False)
    total_cost = Column(Float, nullable=False)
    supplier = Column(String, nullable=False)
    ordered_at = Column(DateTime, server_default=func.now())
