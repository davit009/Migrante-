'use client';

// ============================================================
// features/calculator/components/StateSelectorUsa.tsx
// Selector de Estado de EE.UU. con tasas oficiales de impuesto
// ============================================================

import { USA_STATES_LIST } from '@/constants/usa-states';
import { formatTaxRate } from '@/utils/tax.utils';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface StateSelectorUsaProps {
  selectedState: string;
  onStateChange: (stateCode: string) => void;
}

export function StateSelectorUsa({ selectedState, onStateChange }: StateSelectorUsaProps) {
  const currentState = USA_STATES_LIST.find((s) => s.code === selectedState);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="state-select" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Estado de EE.UU. (Sales Tax)
        </Label>
        {currentState && (
          <Badge variant="secondary" className="text-xs font-bold rounded-full px-2.5 py-0.5 bg-primary/10 text-primary border-none">
            Impuesto: {formatTaxRate(currentState.rate)}
          </Badge>
        )}
      </div>

      <Select value={selectedState} onValueChange={(val) => val && onStateChange(val)}>
        <SelectTrigger id="state-select" className="w-full h-11 rounded-2xl border-border bg-card font-medium">
          <SelectValue placeholder="Selecciona un estado..." />
        </SelectTrigger>
        <SelectContent className="max-h-60 rounded-2xl">
          {USA_STATES_LIST.map((state) => (
            <SelectItem key={state.code} value={state.code} className="rounded-xl cursor-pointer">
              <div className="flex items-center justify-between w-full gap-4">
                <span>{state.name} ({state.code})</span>
                <span className="text-xs text-muted-foreground font-mono">
                  {formatTaxRate(state.rate)}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
