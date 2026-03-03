import { useEffect, useState } from "react"
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Button, Input, Chip, Spinner, Card, CardBody,
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  useDisclosure, Select, SelectItem
} from "@heroui/react"
import { Search, Plus } from "lucide-react"
import { api } from "../api/client"

const STATUS_COLORS = {
  Active: "success",
  "Low Stock": "warning",
  Expired: "danger",
  "Out of Stock": "default",
}

const CATEGORIES = ["Tablet", "Syrup", "Injection", "Capsule", "Drops", "Ointment", "Other"]
const STATUSES = ["Active", "Low Stock", "Expired", "Out of Stock"]

const EMPTY_FORM = {
  name: "", category: "", manufacturer: "", batch_number: "",
  quantity: "", min_stock_level: "", price: "", cost_price: "", expiry_date: "",
}

export default function Inventory() {
  const [medicines, setMedicines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [form, setForm] = useState(EMPTY_FORM)
  const [editTarget, setEditTarget] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const fetchMedicines = (s = search, sf = statusFilter) => {
    setLoading(true)
    api.inventory.getMedicines(s, sf)
      .then(setMedicines)
      .catch(() => setError("Failed to load inventory."))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchMedicines() }, [])

  const openAdd = () => {
    setEditTarget(null)
    setForm(EMPTY_FORM)
    onOpen()
  }

  const openEdit = (m) => {
    setEditTarget(m)
    setForm({
      name: m.name, category: m.category, manufacturer: m.manufacturer,
      batch_number: m.batch_number, quantity: String(m.quantity),
      min_stock_level: String(m.min_stock_level), price: String(m.price),
      cost_price: String(m.cost_price), expiry_date: m.expiry_date,
    })
    onOpen()
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    const payload = {
      ...form,
      quantity: Number(form.quantity),
      min_stock_level: Number(form.min_stock_level),
      price: Number(form.price),
      cost_price: Number(form.cost_price),
    }
    try {
      if (editTarget) {
        await api.inventory.updateMedicine(editTarget.id, payload)
      } else {
        await api.inventory.addMedicine(payload)
      }
      onClose()
      fetchMedicines()
    } catch {
      setError("Failed to save medicine.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleStatusChange = async (id, status) => {
    try {
      await api.inventory.updateStatus(id, status)
      fetchMedicines()
    } catch {
      setError("Failed to update status.")
    }
  }

  const handleSearch = (val) => {
    setSearch(val)
    fetchMedicines(val, statusFilter)
  }

  const handleFilter = (val) => {
    setStatusFilter(val)
    fetchMedicines(search, val)
  }

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }))

  return (
    <div className="p-4 md:p-8 flex flex-col gap-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-default-900">Inventory</h1>
        <p className="text-sm text-default-400 mt-1">{medicines.length} medicines in stock</p>
      </div>

      {error && <p className="text-danger text-sm">{error}</p>}

      <Card shadow="sm">
        <CardBody className="px-0 py-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 border-b border-default-100 gap-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
              <Input
                placeholder="Search medicine..."
                value={search}
                onValueChange={handleSearch}
                startContent={<Search size={15} className="text-default-400" />}
                size="sm"
                className="w-full sm:w-52"
              />
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Select
                  placeholder="All statuses"
                  selectedKeys={statusFilter ? [statusFilter] : []}
                  onSelectionChange={(keys) => handleFilter([...keys][0] || "")}
                  size="sm"
                  className="w-full sm:w-40"
                >
                  {STATUSES.map((s) => <SelectItem key={s}>{s}</SelectItem>)}
                </Select>
                {statusFilter && (
                  <Button size="sm" variant="flat" onPress={() => handleFilter("")}>Clear</Button>
                )}
              </div>
            </div>
            <Button
              color="primary"
              size="sm"
              startContent={<Plus size={15} />}
              onPress={openAdd}
              className="w-full sm:w-auto"
            >
              Add Medicine
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-48">
              <Spinner size="lg" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table aria-label="Inventory" removeWrapper className="px-2 pb-2 min-w-[750px]">
                <TableHeader>
                  <TableColumn className="text-xs">Name</TableColumn>
                  <TableColumn className="text-xs">Category</TableColumn>
                  <TableColumn className="text-xs">Manufacturer</TableColumn>
                  <TableColumn className="text-xs">Batch</TableColumn>
                  <TableColumn className="text-xs">Qty</TableColumn>
                  <TableColumn className="text-xs">Price</TableColumn>
                  <TableColumn className="text-xs">Expiry</TableColumn>
                  <TableColumn className="text-xs">Status</TableColumn>
                  <TableColumn className="text-xs">Actions</TableColumn>
                </TableHeader>
                <TableBody emptyContent="No medicines found">
                  {medicines.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell className="text-sm font-medium">{m.name}</TableCell>
                      <TableCell className="text-sm text-default-500">{m.category}</TableCell>
                      <TableCell className="text-sm text-default-500">{m.manufacturer}</TableCell>
                      <TableCell className="text-sm text-default-400">{m.batch_number}</TableCell>
                      <TableCell className="text-sm">{m.quantity}</TableCell>
                      <TableCell className="text-sm">₹{m.price.toFixed(2)}</TableCell>
                      <TableCell className="text-sm text-default-400">{m.expiry_date}</TableCell>
                      <TableCell>
                        <Chip color={STATUS_COLORS[m.status]} size="sm" variant="flat">{m.status}</Chip>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1.5">
                          <Button size="sm" variant="flat" onPress={() => openEdit(m)}>Edit</Button>
                          {m.status !== "Expired" && (
                            <Button size="sm" color="danger" variant="flat" onPress={() => handleStatusChange(m.id, "Expired")}>Expire</Button>
                          )}
                          {m.status !== "Out of Stock" && (
                            <Button size="sm" variant="flat" onPress={() => handleStatusChange(m.id, "Out of Stock")}>Out</Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose} size="2xl" className="mx-2" scrollBehavior="inside">
        <ModalContent>
          <ModalHeader className="text-base font-semibold">
            {editTarget ? "Edit Medicine" : "Add New Medicine"}
          </ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="Name" size="sm" value={form.name} onValueChange={set("name")} />
              <Select
                label="Category"
                size="sm"
                selectedKeys={form.category ? [form.category] : []}
                onSelectionChange={(keys) => set("category")([...keys][0] || "")}
              >
                {CATEGORIES.map((c) => <SelectItem key={c}>{c}</SelectItem>)}
              </Select>
              <Input label="Manufacturer" size="sm" value={form.manufacturer} onValueChange={set("manufacturer")} />
              <Input label="Batch Number" size="sm" value={form.batch_number} onValueChange={set("batch_number")} />
              <Input label="Quantity" size="sm" type="number" value={form.quantity} onValueChange={set("quantity")} />
              <Input label="Min Stock Level" size="sm" type="number" value={form.min_stock_level} onValueChange={set("min_stock_level")} />
              <Input label="Selling Price (₹)" size="sm" type="number" value={form.price} onValueChange={set("price")} />
              <Input label="Cost Price (₹)" size="sm" type="number" value={form.cost_price} onValueChange={set("cost_price")} />
              <Input
                label="Expiry Date"
                size="sm"
                type="date"
                value={form.expiry_date}
                onValueChange={set("expiry_date")}
                className="sm:col-span-2"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" size="sm" onPress={onClose}>Cancel</Button>
            <Button color="primary" size="sm" onPress={handleSubmit} isLoading={submitting}>
              {editTarget ? "Update" : "Add Medicine"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}
