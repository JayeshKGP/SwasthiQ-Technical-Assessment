const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  })
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return res.json()
}

export const api = {
  dashboard: {
    getSalesSummary: () => request("/dashboard/sales-summary"),
    getLowStock: () => request("/dashboard/low-stock"),
    getPurchaseOrders: () => request("/dashboard/purchase-orders"),
    getRecentSales: () => request("/dashboard/recent-sales"),
  },
  inventory: {
    getMedicines: (search = "", status = "") => {
      const params = new URLSearchParams()
      if (search) params.append("search", search)
      if (status) params.append("status", status)
      return request(`/inventory/?${params.toString()}`)
    },
    addMedicine: (data) => request("/inventory/", { method: "POST", body: JSON.stringify(data) }),
    updateMedicine: (id, data) => request(`/inventory/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    updateStatus: (id, status) => request(`/inventory/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  },
}
