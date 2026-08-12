"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

interface RangeSliderProps {
  min: number;
  max: number;
  step?: number;
  valueMin: number;
  valueMax: number;
  onChange: (valueMin: number, valueMax: number) => void;
  formatValue?: (value: number) => string;
  className?: string;
}

export function RangeSlider({ min, max, step = 1, valueMin, valueMax, onChange, formatValue, className }: RangeSliderProps) {
  const id = useId();
  const span = Math.max(max - min, 1);
  const lowPct = ((valueMin - min) / span) * 100;
  const highPct = ((valueMax - min) / span) * 100;
  const format = formatValue ?? ((v: number) => String(v));

  function handleMin(next: number) {
    onChange(Math.min(next, valueMax), valueMax);
  }
  function handleMax(next: number) {
    onChange(valueMin, Math.max(next, valueMin));
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="relative h-4">
        <div className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 bg-warm-200" />
        <div
          className="absolute top-1/2 h-[3px] -translate-y-1/2 bg-gold-500"
          style={{ left: `${lowPct}%`, right: `${100 - highPct}%` }}
        />
        <input
          id={`${id}-min`}
          type="range"
          min={min}
          max={max}
          step={step}
          value={valueMin}
          onChange={(e) => handleMin(Number(e.target.value))}
          className={cn(rangeInputClass, valueMin > max - span * 0.15 ? "z-30" : "z-20")}
          aria-label="Minimum price"
        />
        <input
          id={`${id}-max`}
          type="range"
          min={min}
          max={max}
          step={step}
          value={valueMax}
          onChange={(e) => handleMax(Number(e.target.value))}
          className={cn(rangeInputClass, "z-20")}
          aria-label="Maximum price"
        />
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-warm-600">
        <span>{format(valueMin)}</span>
        <span>{format(valueMax)}</span>
      </div>
    </div>
  );
}

const rangeInputClass = cn(
  "absolute inset-x-0 top-1/2 h-4 w-full -translate-y-1/2 appearance-none bg-transparent",
  "pointer-events-none",
  "[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none",
  "[&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full",
  "[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-gold-500 [&::-webkit-slider-thumb]:bg-white",
  "[&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:cursor-pointer",
  "[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4",
  "[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-gold-500",
  "[&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-sm",
  "[&::-webkit-slider-runnable-track]:bg-transparent [&::-moz-range-track]:bg-transparent"
);
