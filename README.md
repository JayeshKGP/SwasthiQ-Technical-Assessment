# SwasthiQ Pharmacy Module

A simplified Pharmacy Management System with a Dashboard and Inventory page.

**Live:** https://swasthiq-frontend.up.railway.app/

---

## Stack

- **Frontend:** React + Vite + HeroUI
- **Backend:** FastAPI + SQLAlchemy
- **Database:** PostgreSQL (Railway) / SQLite (local)

---

## Running Locally

**Backend**
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

Set `VITE_API_URL=http://localhost:8000` in `frontend/.env`.

---

## API Structure

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard/sales-summary` | Today's total revenue and items sold |
| GET | `/dashboard/low-stock` | Medicines below minimum stock level |
| GET | `/dashboard/purchase-orders` | All purchase orders |
| GET | `/dashboard/recent-sales` | Last 10 sales |

### Inventory
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/inventory/` | List all medicines (supports `search` and `status` filters) |
| POST | `/inventory/` | Add a new medicine |
| PUT | `/inventory/{id}` | Update medicine details |
| PATCH | `/inventory/{id}/status` | Mark as Expired or Out of Stock |

---

## Data Consistency on Update

Whenever a medicine is updated via `PUT /inventory/{id}`, the status is recomputed automatically before saving:

- `expiry_date` is in the past → **Expired**
- `quantity` is 0 → **Out of Stock**
- `quantity` ≤ `min_stock_level` → **Low Stock**
- Otherwise → **Active**

This means the status field is never out of sync with the actual stock and expiry data. The `PATCH /status` endpoint exists to manually override this (e.g. mark something expired early), but every regular update goes through the same recompute logic.

---

## Production

- Backend hosted on Railway
- Frontend hosted on Railway (static)
- Database: PostgreSQL on Railway
- Environment variables used for all secrets — no hardcoded credentials
