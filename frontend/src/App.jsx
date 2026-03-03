import { useState } from "react"
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom"
import { HeroUIProvider } from "@heroui/react"
import { LayoutDashboard, Package, Menu, X } from "lucide-react"
import Dashboard from "./pages/Dashboard"
import Inventory from "./pages/Inventory"

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/inventory", label: "Inventory", icon: Package },
]

function NavLinks({ onNavigate }) {
  return (
    <nav className="flex flex-col gap-1 p-3 flex-1">
      {navItems.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? "bg-primary text-white"
                : "text-default-600 hover:bg-default-100"
            }`
          }
        >
          <Icon size={17} />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}

function Brand() {
  return (
    <div className="px-6 py-5 border-b border-default-100">
      <span className="text-xl font-bold text-primary">SwasthiQ</span>
      <p className="text-xs text-default-400 mt-0.5">Pharmacy Module</p>
    </div>
  )
}

export default function App() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <HeroUIProvider>
      <BrowserRouter>
        <div className="flex min-h-screen bg-default-50">

          {/* Desktop sidebar */}
          <aside className="hidden md:flex w-56 min-h-screen bg-white border-r border-default-100 flex-col shrink-0">
            <Brand />
            <NavLinks />
          </aside>

          {/* Mobile drawer overlay */}
          {drawerOpen && (
            <div
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
              onClick={() => setDrawerOpen(false)}
            />
          )}

          {/* Mobile drawer */}
          <aside
            className={`fixed top-0 left-0 h-full w-56 bg-white z-50 flex flex-col transform transition-transform duration-250 md:hidden ${
              drawerOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-default-100">
              <div>
                <span className="text-xl font-bold text-primary">SwasthiQ</span>
                <p className="text-xs text-default-400 mt-0.5">Pharmacy Module</p>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="text-default-400 hover:text-default-700"
              >
                <X size={18} />
              </button>
            </div>
            <NavLinks onNavigate={() => setDrawerOpen(false)} />
          </aside>

          {/* Main content */}
          <div className="flex-1 flex flex-col min-w-0">

            {/* Mobile top bar */}
            <header className="md:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-default-100 sticky top-0 z-30">
              <button
                onClick={() => setDrawerOpen(true)}
                className="text-default-600"
              >
                <Menu size={20} />
              </button>
              <span className="font-bold text-primary">SwasthiQ</span>
            </header>

            <main className="flex-1 overflow-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/inventory" element={<Inventory />} />
              </Routes>
            </main>
          </div>

        </div>
      </BrowserRouter>
    </HeroUIProvider>
  )
}
