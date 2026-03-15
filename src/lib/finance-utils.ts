import { CISTaxStatus, InvoiceStatus, InvoiceType, ValuationStatus } from "@prisma/client"

export const INVOICE_STATUS_STYLES: Record<InvoiceStatus, { bg: string; text: string; label: string }> = {
  DRAFT: { bg: "bg-gray-100", text: "text-gray-600", label: "Draft" },
  SENT: { bg: "bg-blue-100", text: "text-blue-800", label: "Sent" },
  PAID: { bg: "bg-green-100", text: "text-green-800", label: "Paid" },
  OVERDUE: { bg: "bg-red-100", text: "text-red-800", label: "Overdue" },
  VOID: { bg: "bg-gray-200", text: "text-gray-500", label: "Void" },
}

export const INVOICE_TYPE_STYLES: Record<InvoiceType, { bg: string; text: string; label: string }> = {
  SALES: { bg: "bg-emerald-100", text: "text-emerald-800", label: "Sales" },
  PURCHASE: { bg: "bg-purple-100", text: "text-purple-800", label: "Purchase" },
  CIS: { bg: "bg-amber-100", text: "text-amber-800", label: "CIS" },
}

export const VALUATION_STATUS_STYLES: Record<ValuationStatus, { bg: string; text: string; label: string }> = {
  DRAFT: { bg: "bg-gray-100", text: "text-gray-600", label: "Draft" },
  SUBMITTED: { bg: "bg-blue-100", text: "text-blue-800", label: "Submitted" },
  CERTIFIED: { bg: "bg-amber-100", text: "text-amber-800", label: "Certified" },
  PAID: { bg: "bg-green-100", text: "text-green-800", label: "Paid" },
}

export function getCISRate(status: CISTaxStatus): number {
  switch (status) {
    case "GROSS": return 0
    case "NET": return 20
    case "HIGHER_RATE": return 30
    case "UNMATCHED": return 30
    case "NOT_VERIFIED": return 30
    default: return 30
  }
}

export function getCISTaxMonth(date: Date): string {
  // UK CIS tax months run 6th to 5th
  // If date is 6th or later, it belongs to current month's tax month
  // If date is 1st-5th, it belongs to previous month's tax month
  const d = new Date(date)
  if (d.getDate() < 6) {
    d.setMonth(d.getMonth() - 1)
  }
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
}

export function formatMoney(value: number | string | null | undefined): string {
  if (value == null) return "£0.00"
  const num = typeof value === "string" ? parseFloat(value) : value
  if (isNaN(num)) return "£0.00"
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num)
}

export function formatMoneyShort(value: number | string | null | undefined): string {
  if (value == null) return "£0"
  const num = typeof value === "string" ? parseFloat(value) : value
  if (isNaN(num)) return "£0"
  if (Math.abs(num) >= 1000000) {
    return `£${(num / 1000000).toFixed(1)}M`
  }
  if (Math.abs(num) >= 1000) {
    return `£${(num / 1000).toFixed(0)}k`
  }
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(num)
}
