"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, ChevronDown, ChevronUp, GripVertical } from "lucide-react"
import {
  EstimateSectionData, EstimateItemData, EstimateTotals,
  itemTotal, sectionTotal, calculateEstimateTotals,
  formatMoney, marginBgColour, UNIT_OPTIONS,
} from "@/lib/estimate-utils"
import { cn } from "@/lib/utils"

interface CostBuilderProps {
  sections: EstimateSectionData[]
  onSectionsChange: (sections: EstimateSectionData[]) => void
  overheadPercent: number
  onOverheadChange: (v: number) => void
  marginPercent: number
  onMarginChange: (v: number) => void
  totals: EstimateTotals
}

function emptyItem(): EstimateItemData {
  return {
    description: "",
    unit: "nr",
    quantity: 1,
    material_cost: 0,
    labour_cost: 0,
    plant_cost: 0,
    subcontract_cost: 0,
  }
}

export default function CostBuilder({
  sections, onSectionsChange,
  overheadPercent, onOverheadChange,
  marginPercent, onMarginChange,
  totals,
}: CostBuilderProps) {
  const [collapsedSections, setCollapsedSections] = useState<Set<number>>(new Set())

  const toggleCollapse = (idx: number) => {
    const next = new Set(collapsedSections)
    next.has(idx) ? next.delete(idx) : next.add(idx)
    setCollapsedSections(next)
  }

  const addSection = () => {
    onSectionsChange([
      ...sections,
      { name: "", order: sections.length + 1, items: [emptyItem()] },
    ])
  }

  const removeSection = (idx: number) => {
    onSectionsChange(sections.filter((_, i) => i !== idx).map((s, i) => ({ ...s, order: i + 1 })))
  }

  const updateSection = (idx: number, field: string, value: string) => {
    const next = [...sections]
    next[idx] = { ...next[idx], [field]: value }
    onSectionsChange(next)
  }

  const addItem = (secIdx: number) => {
    const next = [...sections]
    next[secIdx] = { ...next[secIdx], items: [...next[secIdx].items, emptyItem()] }
    onSectionsChange(next)
  }

  const removeItem = (secIdx: number, itemIdx: number) => {
    const next = [...sections]
    next[secIdx] = { ...next[secIdx], items: next[secIdx].items.filter((_, i) => i !== itemIdx) }
    onSectionsChange(next)
  }

  const updateItem = (secIdx: number, itemIdx: number, field: string, value: string | number) => {
    const next = [...sections]
    const items = [...next[secIdx].items]
    items[itemIdx] = { ...items[itemIdx], [field]: value }
    next[secIdx] = { ...next[secIdx], items }
    onSectionsChange(next)
  }

  return (
    <div className="space-y-4">
      {sections.map((sec, secIdx) => {
        const secTot = sectionTotal(sec.items)
        const collapsed = collapsedSections.has(secIdx)

        return (
          <Card key={secIdx} className="overflow-hidden">
            {/* Section header */}
            <div className="flex items-center gap-2 p-3 bg-gray-50 border-b">
              <GripVertical className="w-4 h-4 text-gray-300 cursor-grab" />
              <button onClick={() => toggleCollapse(secIdx)} className="text-gray-400 hover:text-gray-600">
                {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>
              <Input
                value={sec.name}
                onChange={(e) => updateSection(secIdx, "name", e.target.value)}
                placeholder="Section name (e.g. Groundworks)"
                className="flex-1 h-8 font-semibold bg-white"
              />
              <span className="font-mono text-sm font-semibold text-[#1A1A2E] min-w-[100px] text-right">
                {formatMoney(secTot)}
              </span>
              <Button
                variant="ghost" size="sm"
                onClick={() => removeSection(secIdx)}
                className="text-red-400 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            {!collapsed && (
              <CardContent className="p-0">
                {/* Column headers */}
                <div className="grid grid-cols-[1fr_70px_60px_90px_90px_90px_90px_80px_32px] gap-1 px-3 py-2 bg-gray-50/50 border-b text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                  <span>Description</span>
                  <span>Unit</span>
                  <span className="text-right">Qty</span>
                  <span className="text-right">Material</span>
                  <span className="text-right">Labour</span>
                  <span className="text-right">Plant</span>
                  <span className="text-right">Subcon</span>
                  <span className="text-right">Total</span>
                  <span></span>
                </div>

                {/* Items */}
                {sec.items.map((item, itemIdx) => {
                  const total = itemTotal(item)
                  return (
                    <div
                      key={itemIdx}
                      className="grid grid-cols-[1fr_70px_60px_90px_90px_90px_90px_80px_32px] gap-1 px-3 py-1.5 border-b border-gray-100 hover:bg-gray-50/50 items-center"
                    >
                      <Input
                        value={item.description}
                        onChange={(e) => updateItem(secIdx, itemIdx, "description", e.target.value)}
                        placeholder="Line item description"
                        className="h-7 text-sm border-gray-200"
                      />
                      <select
                        value={item.unit}
                        onChange={(e) => updateItem(secIdx, itemIdx, "unit", e.target.value)}
                        className="h-7 rounded border border-gray-200 bg-white px-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#F97316]"
                      >
                        {UNIT_OPTIONS.map((u) => (
                          <option key={u.value} value={u.value}>{u.label}</option>
                        ))}
                      </select>
                      <Input
                        type="number"
                        value={item.quantity || ""}
                        onChange={(e) => updateItem(secIdx, itemIdx, "quantity", parseFloat(e.target.value) || 0)}
                        className="h-7 text-sm text-right font-mono border-gray-200"
                        step="0.01"
                      />
                      <Input
                        type="number"
                        value={item.material_cost || ""}
                        onChange={(e) => updateItem(secIdx, itemIdx, "material_cost", parseFloat(e.target.value) || 0)}
                        className="h-7 text-sm text-right font-mono border-gray-200"
                        step="0.01"
                        placeholder="0.00"
                      />
                      <Input
                        type="number"
                        value={item.labour_cost || ""}
                        onChange={(e) => updateItem(secIdx, itemIdx, "labour_cost", parseFloat(e.target.value) || 0)}
                        className="h-7 text-sm text-right font-mono border-gray-200"
                        step="0.01"
                        placeholder="0.00"
                      />
                      <Input
                        type="number"
                        value={item.plant_cost || ""}
                        onChange={(e) => updateItem(secIdx, itemIdx, "plant_cost", parseFloat(e.target.value) || 0)}
                        className="h-7 text-sm text-right font-mono border-gray-200"
                        step="0.01"
                        placeholder="0.00"
                      />
                      <Input
                        type="number"
                        value={item.subcontract_cost || ""}
                        onChange={(e) => updateItem(secIdx, itemIdx, "subcontract_cost", parseFloat(e.target.value) || 0)}
                        className="h-7 text-sm text-right font-mono border-gray-200"
                        step="0.01"
                        placeholder="0.00"
                      />
                      <span className="font-mono text-sm text-right font-semibold text-[#1A1A2E] pr-1">
                        {formatMoney(total)}
                      </span>
                      <Button
                        variant="ghost" size="sm"
                        onClick={() => removeItem(secIdx, itemIdx)}
                        className="text-red-300 hover:text-red-500 h-7 w-7 p-0"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  )
                })}

                {/* Add item */}
                <div className="p-2 border-t border-dashed border-gray-200">
                  <Button variant="ghost" size="sm" onClick={() => addItem(secIdx)} className="text-xs text-gray-500">
                    <Plus className="w-3 h-3" /> Add Line Item
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        )
      })}

      {/* Add section */}
      <Button variant="outline" onClick={addSection} className="w-full border-dashed">
        <Plus className="w-4 h-4" /> Add Section
      </Button>

      {/* Summary */}
      <Card className="bg-[#1A1A2E] text-white">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Estimate Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-300">
              <span>Subtotal (cost)</span>
              <span className="font-mono">{formatMoney(totals.subtotal)}</span>
            </div>
            <div className="flex justify-between items-center text-gray-300">
              <div className="flex items-center gap-2">
                <span>Overheads</span>
                <Input
                  type="number"
                  value={overheadPercent}
                  onChange={(e) => onOverheadChange(parseFloat(e.target.value) || 0)}
                  className="w-16 h-7 text-sm text-right font-mono bg-white/10 border-white/20 text-white"
                  step="0.5"
                />
                <span className="text-xs">%</span>
              </div>
              <span className="font-mono">{formatMoney(totals.overheadAmount)}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Net Cost</span>
              <span className="font-mono">{formatMoney(totals.netCost)}</span>
            </div>
            <div className="border-t border-white/10 pt-3" />
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Margin</span>
                <Input
                  type="number"
                  value={marginPercent}
                  onChange={(e) => onMarginChange(parseFloat(e.target.value) || 0)}
                  className="w-16 h-7 text-sm text-right font-mono bg-white/10 border-white/20 text-white"
                  step="0.5"
                />
                <span className="text-xs">%</span>
                <span className={cn(
                  "px-2 py-0.5 rounded text-xs font-bold border",
                  marginBgColour(marginPercent)
                )}>
                  {marginPercent > 15 ? "GOOD" : marginPercent >= 10 ? "OK" : "LOW"}
                </span>
              </div>
              <span className="font-mono font-semibold">{formatMoney(totals.marginAmount)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Selling Price (excl. VAT)</span>
              <span className="font-mono">{formatMoney(totals.sellPrice)}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>VAT @ 20%</span>
              <span className="font-mono">{formatMoney(totals.vat)}</span>
            </div>
            <div className="border-t border-white/20 pt-3" />
            <div className="flex justify-between text-xl font-bold text-[#F97316]">
              <span>Grand Total (incl. VAT)</span>
              <span className="font-mono">{formatMoney(totals.grandTotal)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
