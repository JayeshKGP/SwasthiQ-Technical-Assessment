import { useEffect, useState } from "react"
import {
  Card, CardBody, Spinner,
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip
} from "@heroui/react"
import { IndianRupee, ShoppingCart, AlertTriangle, ClipboardList } from "lucide-react"
import { api } from "../api/client"

const STATUS_COLORS = {
  Active: "success",
  "Low Stock": "warning",
  Expired: "danger",
  "Out of Stock": "default",
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <Card shadow="sm">
      <CardBody className="flex flex-row items-center gap-3 py-4 px-4">
        <div className={`p-2.5 rounded-xl bg-${color}-100 shrink-0`}>
          <Icon size={18} className={`text-${color}-600`} />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-default-400 font-medium uppercase tracking-wide truncate">{label}</p>
          <p className="text-xl font-bold text-default-800 mt-0.5 truncate">{value}</p>
        </div>
      </CardBody>
    </Card>
  )
}

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [lowStock, setLowStock] = useState([])
  const [orders, setOrders] = useState([])
  const [recentSales, setRecentSales] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([
      api.dashboard.getSalesSummary(),
      api.dashboard.getLowStock(),
      api.dashboard.getPurchaseOrders(),
      api.dashboard.getRecentSales(),
    ])
      .then(([s, ls, po, rs]) => {
        setSummary(s)
        setLowStock(ls)
        setOrders(po)
        setRecentSales(rs)
      })
      .catch(() => setError("Failed to load dashboard data."))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    return <p className="text-danger text-center mt-16 text-sm">{error}</p>
  }

  return (
    <div className="p-4 md:p-8 flex flex-col gap-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-default-900">Dashboard</h1>
        <p className="text-sm text-default-400 mt-1">Sales overview for today</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard icon={IndianRupee} label="Today's Revenue" value={`₹${summary.total_sales_today.toFixed(2)}`} color="primary" />
        <StatCard icon={ShoppingCart} label="Items Sold" value={summary.total_items_sold_today} color="success" />
        <StatCard icon={AlertTriangle} label="Low Stock" value={lowStock.length} color="warning" />
        <StatCard icon={ClipboardList} label="Purchase Orders" value={orders.length} color="secondary" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card shadow="sm">
          <CardBody className="px-0 py-0">
            <div className="px-4 py-3 border-b border-default-100">
              <h2 className="text-sm font-semibold text-default-700">Recent Sales</h2>
            </div>
            <div className="overflow-x-auto">
              <Table aria-label="Recent Sales" removeWrapper className="px-2 pb-2 min-w-[400px]">
                <TableHeader>
                  <TableColumn className="text-xs">Medicine</TableColumn>
                  <TableColumn className="text-xs">Qty</TableColumn>
                  <TableColumn className="text-xs">Amount</TableColumn>
                  <TableColumn className="text-xs">Date</TableColumn>
                </TableHeader>
                <TableBody emptyContent="No recent sales">
                  {recentSales.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="text-sm">{s.medicine_name}</TableCell>
                      <TableCell className="text-sm">{s.quantity_sold}</TableCell>
                      <TableCell className="text-sm font-medium">₹{s.total_amount.toFixed(2)}</TableCell>
                      <TableCell className="text-sm text-default-400">{new Date(s.sold_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardBody>
        </Card>

        <Card shadow="sm">
          <CardBody className="px-0 py-0">
            <div className="px-4 py-3 border-b border-default-100">
              <h2 className="text-sm font-semibold text-default-700">Purchase Orders</h2>
            </div>
            <div className="overflow-x-auto">
              <Table aria-label="Purchase Orders" removeWrapper className="px-2 pb-2 min-w-[380px]">
                <TableHeader>
                  <TableColumn className="text-xs">Medicine</TableColumn>
                  <TableColumn className="text-xs">Qty</TableColumn>
                  <TableColumn className="text-xs">Supplier</TableColumn>
                  <TableColumn className="text-xs">Cost</TableColumn>
                </TableHeader>
                <TableBody emptyContent="No purchase orders">
                  {orders.map((o) => (
                    <TableRow key={o.id}>
                      <TableCell className="text-sm">{o.medicine_name}</TableCell>
                      <TableCell className="text-sm">{o.quantity_ordered}</TableCell>
                      <TableCell className="text-sm text-default-500">{o.supplier}</TableCell>
                      <TableCell className="text-sm font-medium">₹{o.total_cost.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card shadow="sm">
        <CardBody className="px-0 py-0">
          <div className="px-4 py-3 border-b border-default-100">
            <h2 className="text-sm font-semibold text-default-700">Low Stock Alerts</h2>
          </div>
          <div className="overflow-x-auto">
            <Table aria-label="Low Stock" removeWrapper className="px-2 pb-2 min-w-[500px]">
              <TableHeader>
                <TableColumn className="text-xs">Medicine</TableColumn>
                <TableColumn className="text-xs">Category</TableColumn>
                <TableColumn className="text-xs">Quantity</TableColumn>
                <TableColumn className="text-xs">Min Level</TableColumn>
                <TableColumn className="text-xs">Status</TableColumn>
              </TableHeader>
              <TableBody emptyContent="All stock levels are fine">
                {lowStock.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="text-sm font-medium">{m.name}</TableCell>
                    <TableCell className="text-sm text-default-500">{m.category}</TableCell>
                    <TableCell className="text-sm">{m.quantity}</TableCell>
                    <TableCell className="text-sm">{m.min_stock_level}</TableCell>
                    <TableCell>
                      <Chip color={STATUS_COLORS[m.status]} size="sm" variant="flat">{m.status}</Chip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
