// Estimate calculation utilities

export interface EstimateItemData {
  id?: string
  description: string
  unit: string
  quantity: number
  material_cost: number
  labour_cost: number
  plant_cost: number
  subcontract_cost: number
}

export interface EstimateSectionData {
  id?: string
  name: string
  order: number
  items: EstimateItemData[]
}

export interface EstimateTotals {
  subtotal: number
  overheadAmount: number
  netCost: number
  sellPrice: number
  vat: number
  grandTotal: number
  marginAmount: number
}

/** Per item total = (material + labour + plant + subcontract) × quantity */
export function itemTotal(item: EstimateItemData): number {
  return (
    (Number(item.material_cost) + Number(item.labour_cost) + Number(item.plant_cost) + Number(item.subcontract_cost)) *
    Number(item.quantity)
  )
}

/** Per section total = sum of all item totals */
export function sectionTotal(items: EstimateItemData[]): number {
  return items.reduce((sum, item) => sum + itemTotal(item), 0)
}

/** Full estimate totals */
export function calculateEstimateTotals(
  sections: EstimateSectionData[],
  overheadPercent: number,
  marginPercent: number
): EstimateTotals {
  const subtotal = sections.reduce((sum, sec) => sum + sectionTotal(sec.items), 0)
  const overheadAmount = subtotal * (overheadPercent / 100)
  const netCost = subtotal + overheadAmount
  const sellPrice = marginPercent >= 100 ? netCost : netCost / (1 - marginPercent / 100)
  const marginAmount = sellPrice - netCost
  const vat = sellPrice * 0.2
  const grandTotal = sellPrice + vat

  return { subtotal, overheadAmount, netCost, sellPrice, vat, grandTotal, marginAmount }
}

/** Format money value */
export function formatMoney(value: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/** Format money compact (no decimals) */
export function formatMoneyCompact(value: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value)
}

/** Margin colour class */
export function marginColour(percent: number): string {
  if (percent > 15) return "text-green-600"
  if (percent >= 10) return "text-amber-600"
  return "text-red-600"
}

/** Margin bg colour class */
export function marginBgColour(percent: number): string {
  if (percent > 15) return "bg-green-100 text-green-800 border-green-200"
  if (percent >= 10) return "bg-amber-100 text-amber-800 border-amber-200"
  return "bg-red-100 text-red-800 border-red-200"
}

export const UNIT_OPTIONS = [
  { value: "m²", label: "m²" },
  { value: "m³", label: "m³" },
  { value: "m", label: "m" },
  { value: "nr", label: "nr" },
  { value: "item", label: "item" },
  { value: "hrs", label: "hrs" },
  { value: "days", label: "days" },
  { value: "weeks", label: "weeks" },
  { value: "lot", label: "lot" },
]

export const ESTIMATE_STATUS_COLOURS: Record<string, { bg: string; text: string; label: string }> = {
  DRAFT: { bg: "bg-gray-100", text: "text-gray-700", label: "Draft" },
  SUBMITTED: { bg: "bg-blue-100", text: "text-blue-800", label: "Submitted" },
  ACCEPTED: { bg: "bg-green-100", text: "text-green-800", label: "Accepted" },
  DECLINED: { bg: "bg-red-100", text: "text-red-800", label: "Declined" },
  REVISED: { bg: "bg-purple-100", text: "text-purple-800", label: "Revised" },
}
