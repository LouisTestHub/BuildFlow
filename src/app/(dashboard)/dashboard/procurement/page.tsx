"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Plus, Package, TrendingUp, AlertCircle, CheckCircle, Clock, Search, Filter
} from "lucide-react"
import { cn } from "@/lib/utils"

interface PurchaseOrder {
  id: string
  poNumber: string
  supplier: string
  jobRef: string | null
  orderDate: string
  deliveryDate: string | null
  items: { description: string; quantity: number; unitPrice: number }[]
  subtotal: number
  vat: number
  total: number
  status: "draft" | "issued" | "acknowledged" | "delivered" | "invoiced" | "cancelled"
  approvedBy: string | null
}

const STATUS_COLORS = {
  draft: "bg-gray-100 text-gray-700",
  issued: "bg-blue-100 text-blue-700",
  acknowledged: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  invoiced: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
}

export default function ProcurementPage() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([
    {
      id: "1",
      poNumber: "PO-2024-001",
      supplier: "BuildSupply Ltd",
      jobRef: "JOB-2024-003",
      orderDate: "2024-03-10",
      deliveryDate: "2024-03-17",
      items: [
        { description: "Concrete blocks 440x215x100", quantity: 500, unitPrice: 1.85 },
        { description: "Building sand (tonne)", quantity: 3, unitPrice: 45.00 },
      ],
      subtotal: 1060.00,
      vat: 212.00,
      total: 1272.00,
      status: "delivered",
      approvedBy: "James Morrison",
    },
    {
      id: "2",
      poNumber: "PO-2024-002",
      supplier: "Timber Warehouse",
      jobRef: "JOB-2024-005",
      orderDate: "2024-03-12",
      deliveryDate: "2024-03-20",
      items: [
        { description: "C16 timber 4x2 @ 4.8m", quantity: 40, unitPrice: 8.50 },
        { description: "Plywood 18mm 8x4", quantity: 12, unitPrice: 42.00 },
      ],
      subtotal: 844.00,
      vat: 168.80,
      total: 1012.80,
      status: "acknowledged",
      approvedBy: "James Morrison",
    },
    {
      id: "3",
      poNumber: "PO-2024-003",
      supplier: "Electrical Supplies Co",
      jobRef: null,
      orderDate: "2024-03-14",
      deliveryDate: null,
      items: [
        { description: "Twin & earth 2.5mm 100m", quantity: 5, unitPrice: 65.00 },
      ],
      subtotal: 325.00,
      vat: 65.00,
      total: 390.00,
      status: "draft",
      approvedBy: null,
    },
  ])

  const [showForm, setShowForm] = useState(false)
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null)

  const stats = {
    totalOrders: orders.length,
    totalValue: orders.reduce((sum, po) => sum + po.total, 0),
    pendingDelivery: orders.filter(po => po.status === "issued" || po.status === "acknowledged").length,
    awaitingInvoice: orders.filter(po => po.status === "delivered").length,
  }

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(val)

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1A1A2E]">Procurement</h2>
          <p className="text-sm text-gray-500">Purchase orders, supplier management & material tracking</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" /> New Purchase Order
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500">Total Orders</p>
            <p className="text-2xl font-bold text-[#1A1A2E] mt-1">{stats.totalOrders}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500">Total Value</p>
            <p className="text-2xl font-bold text-[#1A1A2E] mt-1">{formatCurrency(stats.totalValue)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500">Pending Delivery</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{stats.pendingDelivery}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500">Awaiting Invoice</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{stats.awaitingInvoice}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input placeholder="Search purchase orders..." className="pl-10" />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" /> Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Purchase Orders List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Purchase Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {orders.map(po => (
              <div
                key={po.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-[#F97316] transition-colors cursor-pointer"
                onClick={() => setSelectedPO(po)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono font-semibold text-[#1A1A2E]">{po.poNumber}</span>
                      <Badge className={cn(STATUS_COLORS[po.status], "border-0 text-xs")}>
                        {po.status}
                      </Badge>
                      {po.jobRef && (
                        <span className="text-xs text-gray-500">→ {po.jobRef}</span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-700">{po.supplier}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-2">
                      <span>Ordered: {new Date(po.orderDate).toLocaleDateString("en-GB")}</span>
                      {po.deliveryDate && (
                        <span>Delivery: {new Date(po.deliveryDate).toLocaleDateString("en-GB")}</span>
                      )}
                      <span>{po.items.length} item{po.items.length !== 1 ? "s" : ""}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold font-mono text-[#1A1A2E]">{formatCurrency(po.total)}</p>
                    {po.approvedBy && (
                      <p className="text-xs text-gray-500 mt-1">Approved by {po.approvedBy}</p>
                    )}
                  </div>
                </div>
                {selectedPO?.id === po.id && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm font-medium text-gray-700 mb-2">Order Items:</p>
                    <div className="space-y-2">
                      {po.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-gray-600">{item.description} (x{item.quantity})</span>
                          <span className="font-mono">{formatCurrency(item.quantity * item.unitPrice)}</span>
                        </div>
                      ))}
                      <div className="pt-2 border-t border-gray-100 flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-mono">{formatCurrency(po.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">VAT (20%)</span>
                        <span className="font-mono">{formatCurrency(po.vat)}</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span className="font-mono">{formatCurrency(po.total)}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline" className="flex-1">Edit PO</Button>
                      <Button size="sm" className="flex-1">Update Status</Button>
                      <Button size="sm" variant="outline">Print</Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Supplier Directory */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Supplier Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {["BuildSupply Ltd", "Timber Warehouse", "Electrical Supplies Co", "Plumbing Direct", "Roofing Materials UK"].map((supplier, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-3 hover:border-[#F97316] transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#F97316]/10 flex items-center justify-center">
                    <Package className="w-5 h-5 text-[#F97316]" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-[#1A1A2E]">{supplier}</p>
                    <p className="text-xs text-gray-500">{Math.floor(Math.random() * 5) + 1} orders</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
