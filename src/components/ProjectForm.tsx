import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Layers, Ruler, Clock } from 'lucide-react';
import type { ProjectInput } from '@/lib/calculations';

interface Props {
  onSubmit: (input: ProjectInput) => void;
}

export default function ProjectForm({ onSubmit }: Props) {
  const [area, setArea] = useState('1000');
  const [floors, setFloors] = useState('3');
  const [buildingType, setBuildingType] = useState<ProjectInput['buildingType']>('residential');
  const [targetDays, setTargetDays] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      area: Number(area),
      floors: Number(floors),
      buildingType,
      targetDays: targetDays ? Number(targetDays) : undefined,
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
          <Input
            type="number"
            value={area}
            onChange={e => setArea(e.target.value)}
            min={100}
            placeholder="e.g. 1000"
            className="bg-muted/50 border-border"
            required
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-foreground">
            <Layers className="w-4 h-4 text-primary" /> Number of Floors
          </Label>
          <Input
            type="number"
            value={floors}
            onChange={e => setFloors(e.target.value)}
            min={1}
            max={10}
            placeholder="e.g. 3"
            className="bg-muted/50 border-border"
            required
          />
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
          <Input
            type="number"
            value={targetDays}
            onChange={e => setTargetDays(e.target.value)}
            min={30}
            placeholder="e.g. 90 (for accelerated)"
            className="bg-muted/50 border-border"
          />
        </div>
      </div>

      <Button type="submit" className="w-full gradient-primary text-primary-foreground font-semibold h-12 text-base hover:opacity-90 transition-opacity">
        Generate Construction Plan
      </Button>
    </form>
  );
}
