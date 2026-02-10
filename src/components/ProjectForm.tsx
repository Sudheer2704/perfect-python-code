import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Building2, Layers, Ruler, Clock, IndianRupee, ChevronDown, Settings2 } from 'lucide-react';
import type { ProjectInput } from '@/lib/calculations';

interface Props {
  onSubmit: (input: ProjectInput) => void;
}

export default function ProjectForm({ onSubmit }: Props) {
  const [area, setArea] = useState('1000');
  const [floors, setFloors] = useState('3');
  const [buildingType, setBuildingType] = useState<ProjectInput['buildingType']>('residential');
  const [targetDays, setTargetDays] = useState('');
  const [showRates, setShowRates] = useState(false);

  // Customizable rates
  const [wageRate, setWageRate] = useState('800');
  const [cementRate, setCementRate] = useState('400');
  const [steelRate, setSteelRate] = useState('65000');
  const [sandRate, setSandRate] = useState('50');
  const [aggregateRate, setAggregateRate] = useState('55');
  const [brickRate, setBrickRate] = useState('8');
  const [contingencyPercent, setContingencyPercent] = useState('5');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      area: Number(area),
      floors: Number(floors),
      buildingType,
      targetDays: targetDays ? Number(targetDays) : undefined,
      wageRate: Number(wageRate),
      cementRate: Number(cementRate),
      steelRate: Number(steelRate),
      sandRate: Number(sandRate),
      aggregateRate: Number(aggregateRate),
      brickRate: Number(brickRate),
      contingencyPercent: Number(contingencyPercent),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-xl p-6 md:p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-foreground">Project Parameters</h2>
        <p className="text-muted-foreground text-sm mt-1">Enter your construction details for AI analysis</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-foreground">
            <Ruler className="w-4 h-4 text-primary" /> Plot Area (sq. yards)
          </Label>
          <Input type="number" value={area} onChange={e => setArea(e.target.value)} min={100} placeholder="e.g. 1000" className="bg-muted/50 border-border" required />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-foreground">
            <Layers className="w-4 h-4 text-primary" /> Number of Floors
          </Label>
          <Input type="number" value={floors} onChange={e => setFloors(e.target.value)} min={1} max={10} placeholder="e.g. 3" className="bg-muted/50 border-border" required />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-foreground">
            <Building2 className="w-4 h-4 text-primary" /> Building Type
          </Label>
          <Select value={buildingType} onValueChange={(v) => setBuildingType(v as ProjectInput['buildingType'])}>
            <SelectTrigger className="bg-muted/50 border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="residential">Residential</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="industrial">Industrial</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-foreground">
            <Clock className="w-4 h-4 text-primary" /> Target Days (optional)
          </Label>
          <Input type="number" value={targetDays} onChange={e => setTargetDays(e.target.value)} min={30} placeholder="e.g. 90 (for accelerated)" className="bg-muted/50 border-border" />
        </div>
      </div>

      {/* Scenario 3: Customizable Rates */}
      <Collapsible open={showRates} onOpenChange={setShowRates}>
        <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors w-full">
          <Settings2 className="w-4 h-4" />
          Customize Wage & Material Rates
          <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${showRates ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground flex items-center gap-1"><IndianRupee className="w-3 h-3" /> Wage/day</Label>
              <Input type="number" value={wageRate} onChange={e => setWageRate(e.target.value)} className="bg-muted/50 border-border h-9 text-sm" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Cement/bag</Label>
              <Input type="number" value={cementRate} onChange={e => setCementRate(e.target.value)} className="bg-muted/50 border-border h-9 text-sm" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Steel/ton</Label>
              <Input type="number" value={steelRate} onChange={e => setSteelRate(e.target.value)} className="bg-muted/50 border-border h-9 text-sm" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Sand/cu.ft</Label>
              <Input type="number" value={sandRate} onChange={e => setSandRate(e.target.value)} className="bg-muted/50 border-border h-9 text-sm" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Aggregate/cu.ft</Label>
              <Input type="number" value={aggregateRate} onChange={e => setAggregateRate(e.target.value)} className="bg-muted/50 border-border h-9 text-sm" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Brick/unit</Label>
              <Input type="number" value={brickRate} onChange={e => setBrickRate(e.target.value)} className="bg-muted/50 border-border h-9 text-sm" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Contingency %</Label>
              <Input type="number" value={contingencyPercent} onChange={e => setContingencyPercent(e.target.value)} min={0} max={20} className="bg-muted/50 border-border h-9 text-sm" />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Button type="submit" className="w-full gradient-primary text-primary-foreground font-semibold h-12 text-base hover:opacity-90 transition-opacity">
        Generate Construction Plan
      </Button>
    </form>
  );
}
