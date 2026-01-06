"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

interface TimePickerProps {
    value: string
    onChange: (value: string) => void
}

export function TimePicker({ value, onChange }: TimePickerProps) {
    const [view, setView] = React.useState<"hours" | "minutes">("hours")

    // Parse initial value (HH:mm) to internal state
    const parseTime = (val: string) => {
        if (!val) return { hours: 12, minutes: 0, period: "PM" as const }
        const [h, m] = val.split(":").map(Number)
        const period = h >= 12 ? "PM" : "AM"
        const hours = h % 12 || 12
        return { hours, minutes: m, period: period as "AM" | "PM" }
    }

    const [time, setTime] = React.useState(() => parseTime(value))

    // Sync internal state changes to parent 24h format
    React.useEffect(() => {
        const { hours, minutes, period } = time
        let h = hours
        if (period === "AM" && h === 12) h = 0
        if (period === "PM" && h !== 12) h += 12
        const formatted = `${String(h).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
        if (formatted !== value) {
            // Only trigger if different to avoid loops if parent updates
            // But here we want to push UP changes.
            // Actually, trigger onChange whenever 'time' changes? 
            // We generally wait for explicit user selection usually, but live update is fine.
        }
    }, [time])

    const updateParent = (newTime: typeof time) => {
        let h = newTime.hours
        if (newTime.period === "AM" && h === 12) h = 0
        if (newTime.period === "PM" && h !== 12) h += 12
        const formatted = `${String(h).padStart(2, "0")}:${String(newTime.minutes).padStart(2, "0")}`
        onChange(formatted)
    }

    const handleHourSelect = (h: number) => {
        const newTime = { ...time, hours: h }
        setTime(newTime)
        updateParent(newTime)
        setView("minutes")
    }

    const handleMinuteSelect = (m: number) => {
        const newTime = { ...time, minutes: m }
        setTime(newTime)
        updateParent(newTime)
    }

    const handlePeriodSelect = (p: "AM" | "PM") => {
        const newTime = { ...time, period: p }
        setTime(newTime)
        updateParent(newTime)
    }

    // Generate clock numbers
    const renderClockFace = () => {
        const isHours = view === "hours"
        const numbers = isHours
            ? [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
            : [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]

        const selectedValue = isHours ? time.hours : time.minutes

        return (
            <div className="relative w-64 h-64 bg-gray-100 dark:bg-zinc-800 rounded-full mx-auto my-4 shadow-inner">
                {/* Center Dot */}
                <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2 z-10" />

                {/* Hand (simplified as just selected circle for now, or could rotate) */}
                {/* We'll just highlight the active number for cleaner UI */}

                {numbers.map((num, i) => {
                    // Angle starts at -90deg (12 o clock) roughly?
                    // 12 is at top -> -90deg? 
                    // 3 (index 3) is at 0deg (right)
                    // formula: (index - 3) * 30 + (isHours ? 0 : 0)

                    // Let's strictly place based on clock positions
                    // 12 is at 270deg (or -90). Index 0 is 12.
                    // deg = (i * 30) - 90
                    const angleDeg = (i * 30) - 90
                    const radius = 100 // px

                    // isSelected
                    const isSelected = num === selectedValue

                    return (
                        <button
                            key={num}
                            type="button"
                            onClick={() => isHours ? handleHourSelect(num) : handleMinuteSelect(num)}
                            className={cn(
                                "absolute w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200",
                                isSelected
                                    ? "bg-primary text-primary-foreground scale-110 shadow-lg z-20"
                                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700 hover:scale-105"
                            )}
                            style={{
                                left: `calc(50% + ${radius * Math.cos(angleDeg * Math.PI / 180)}px)`,
                                top: `calc(50% + ${radius * Math.sin(angleDeg * Math.PI / 180)}px)`,
                                transform: 'translate(-50%, -50%)'
                            }}
                        >
                            {isHours ? num : String(num).padStart(2, '0')}
                        </button>
                    )
                })}
            </div>
        )
    }

    return (
        <div className="w-full max-w-sm mx-auto p-4 bg-white dark:bg-zinc-900 rounded-xl border shadow-sm select-none">
            {/* Digital Display Header */}
            <div className="flex items-end justify-center gap-2 mb-6 cursor-pointer">
                <button
                    type="button"
                    onClick={() => setView("hours")}
                    className={cn(
                        "text-5xl font-bold tracking-tight transition-colors",
                        view === "hours" ? "text-primary" : "text-gray-400 dark:text-gray-600"
                    )}
                >
                    {String(time.hours).padStart(2, '0')}
                </button>
                <span className="text-5xl font-bold text-gray-300 dark:text-gray-600 pb-1">:</span>
                <button
                    type="button"
                    onClick={() => setView("minutes")}
                    className={cn(
                        "text-5xl font-bold tracking-tight transition-colors",
                        view === "minutes" ? "text-primary" : "text-gray-400 dark:text-gray-600"
                    )}
                >
                    {String(time.minutes).padStart(2, '0')}
                </button>

                <div className="flex flex-col gap-1 ml-2 text-sm font-bold">
                    <button
                        type="button"
                        onClick={() => handlePeriodSelect("AM")}
                        className={cn(
                            "px-2 py-1 rounded transition-colors",
                            time.period === "AM" ? "bg-primary text-primary-foreground" : "text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800"
                        )}
                    >
                        AM
                    </button>
                    <button
                        type="button"
                        onClick={() => handlePeriodSelect("PM")}
                        className={cn(
                            "px-2 py-1 rounded transition-colors",
                            time.period === "PM" ? "bg-primary text-primary-foreground" : "text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800"
                        )}
                    >
                        PM
                    </button>
                </div>
            </div>

            <div className="text-center text-xs text-muted-foreground uppercase tracking-widest mb-2 font-medium">
                Select {view}
            </div>

            {renderClockFace()}

        </div>
    )
}
