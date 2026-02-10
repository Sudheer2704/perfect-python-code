import { Card } from '@/components/ui/card';
import { Users, Package, IndianRupee, CalendarDays, HardHat, Hammer, Wrench, Paintbrush, Zap, Droplets, Eye, AlertTriangle, TrendingUp } from 'lucide-react';
import type { ProjectResult } from '@/lib/calculations';
import { formatCurrency } from '@/lib/calculations';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface Props {
  result: ProjectResult;
}

const COST_COLORS = ['hsl(25, 95%, 53%)', 'hsl(168, 70%, 40%)', 'hsl(220, 16%, 45%)', 'hsl(0, 70%, 50%)'];

const INTENSITY_COLORS: Record<string, string> = {
  Low: 'bg-green-100 text-green-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  High: 'bg-orange-100 text-orange-800',
  Peak: 'bg-red-100 text-red-800',
};

export default function ResultsDashboard({ result }: Props) {
  const { workers, totalWorkers, totalLaborDays, materials, cost, timeline, weeklySchedule, resourceIntensity, costAnalysis, speedFactor, isAccelerated } = result;

  const costData = [
    { name: 'Labor', value: cost.labor },
    { name: 'Materials', value: cost.materials },
    { name: 'Overhead', value: cost.overhead },
    { name: 'Contingency', value: cost.contingency },
  ];

  const workerData = [
    { name: 'Masons', count: workers.masons, icon: HardHat },
    { name: 'Helpers', count: workers.helpers, icon: Users },
    { name: 'Steel Workers', count: workers.steelWorkers, icon: Hammer },
    { name: 'Carpenters', count: workers.carpenters, icon: Hammer },
    { name: 'Plumbers', count: workers.plumbers, icon: Wrench },
    { name: 'Electricians', count: workers.electricians, icon: Zap },
    { name: 'Painters', count: workers.painters, icon: Paintbrush },
    { name: 'Supervisors', count: workers.supervisors, icon: Eye },
  ];

  const phaseData = timeline.phases.map(p => ({ name: p.name.split(' ')[0], days: p.days, fullName: p.name }));

  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      {/* Acceleration Notice */}
      {isAccelerated && (
        <Card className="border-primary/50 bg-primary/5 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-foreground text-sm">Accelerated Timeline Active</p>
            <p className="text-xs text-muted-foreground">Speed factor: {speedFactor.toFixed(1)}x — Workforce scaled up, material wastage increased by {((speedFactor - 1) * 5).toFixed(1)}%</p>
          </div>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard icon={<Users className="w-5 h-5" />} label="Total Workers" value={totalWorkers.toString()} />
        <SummaryCard icon={<CalendarDays className="w-5 h-5" />} label="Total Days" value={`${timeline.days}`} />
        <SummaryCard icon={<IndianRupee className="w-5 h-5" />} label="Total Cost" value={formatCurrency(cost.total)} />
        <SummaryCard icon={<TrendingUp className="w-5 h-5" />} label="Cost/Sq.Yard" value={formatCurrency(costAnalysis.costPerSqYard)} />
      </div>

      {/* Worker Breakdown */}
      <Card className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-bold font-['Space_Grotesk'] text-foreground mb-4">👷 Workforce Breakdown</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {workerData.map(w => (
            <div key={w.name} className="bg-muted/50 rounded-lg p-3 text-center">
              <w.icon className="w-5 h-5 mx-auto text-primary mb-1" />
              <div className="text-2xl font-bold text-foreground">{w.count}</div>
              <div className="text-xs text-muted-foreground">{w.name}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Resource Intensity */}
      <Card className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-bold font-['Space_Grotesk'] text-foreground mb-4">⚡ Resource Intensity</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {resourceIntensity.map(r => (
            <div key={r.phase} className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-foreground truncate mr-2">{r.phase.split('&')[0].trim()}</span>
                <Badge variant="secondary" className={`text-[10px] shrink-0 ${INTENSITY_COLORS[r.intensity]}`}>{r.intensity}</Badge>
              </div>
              <div className="text-lg font-bold text-foreground">{r.workersPerDay}</div>
              <div className="text-xs text-muted-foreground">workers/day</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Cost & Timeline row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cost Breakdown */}
        <Card className="glass-card rounded-xl p-6">
          <h3 className="text-lg font-bold font-['Space_Grotestring'] text-foreground mb-4">💰 Cost Breakdown</h3>
          <div className="flex items-center gap-6">
            <div className="w-36 h-36">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={costData} cx="50%" cy="50%" innerRadius={35} outerRadius={60} dataKey="value" strokeWidth={2}>
                    {costData.map((_, i) => (
                      <Cell key={i} fill={COST_COLORS[i]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 flex-1">
              {costData.map((item, i) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: COST_COLORS[i] }} />
                    <span className="text-sm text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">{formatCurrency(item.value)}</span>
                </div>
              ))}
              <div className="border-t border-border pt-2 flex justify-between">
                <span className="font-semibold text-foreground text-sm">Total</span>
                <span className="font-bold text-primary text-sm">{formatCurrency(cost.total)}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Timeline Phases */}
        <Card className="glass-card rounded-xl p-6">
          <h3 className="text-lg font-bold font-['Space_Grotesk'] text-foreground mb-4">📅 Timeline ({timeline.months} months)</h3>
          <div className="h-48">
            <ResponsiveContainer>
              <BarChart data={phaseData} layout="vertical" margin={{ left: 0, right: 16, top: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 88%)" />
                <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(220, 10%, 46%)" />
                <YAxis dataKey="name" type="category" width={70} tick={{ fontSize: 11 }} stroke="hsl(220, 10%, 46%)" />
                <Tooltip
                  contentStyle={{ background: 'hsl(0, 0%, 100%)', border: '1px solid hsl(220, 13%, 88%)', borderRadius: '8px', fontSize: 12 }}
                  formatter={(value: number) => [`${value} days`, 'Duration']}
                  labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName || ''}
                />
                <Bar dataKey="days" fill="hsl(25, 95%, 53%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Detailed Material Cost Table (Scenario 3) */}
      <Card className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-bold font-['Space_Grotesk'] text-foreground mb-4">📊 Material Cost Analysis</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <div className="text-xs text-muted-foreground">Cost / Sq. Yard</div>
            <div className="text-lg font-bold text-foreground">{formatCurrency(costAnalysis.costPerSqYard)}</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <div className="text-xs text-muted-foreground">Cost / Sq. Ft</div>
            <div className="text-lg font-bold text-foreground">{formatCurrency(costAnalysis.costPerSqFt)}</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <div className="text-xs text-muted-foreground">Labor Cost / Day</div>
            <div className="text-lg font-bold text-foreground">{formatCurrency(costAnalysis.laborCostPerDay)}</div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Material</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead className="text-right">Rate (₹)</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {costAnalysis.materialCostBreakdown.map(m => (
                <TableRow key={m.item}>
                  <TableCell className="font-medium">{m.item}</TableCell>
                  <TableCell>{m.qty}</TableCell>
                  <TableCell className="text-right">{m.rate.toLocaleString('en-IN')}</TableCell>
                  <TableCell className="text-right font-semibold">{formatCurrency(m.total)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Weekly Schedule (Scenario 2) */}
      <Card className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-bold font-['Space_Grotesk'] text-foreground mb-4">🗓️ Weekly Construction Schedule</h3>
        <div className="overflow-x-auto max-h-80 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Week</TableHead>
                <TableHead>Phase</TableHead>
                <TableHead>Key Activities</TableHead>
                <TableHead className="text-right">Workers</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {weeklySchedule.map(w => (
                <TableRow key={w.week}>
                  <TableCell className="font-bold text-primary">W{w.week}</TableCell>
                  <TableCell className="text-sm">{w.phase}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{w.keyActivities.join(', ')}</TableCell>
                  <TableCell className="text-right font-semibold">{w.workersNeeded}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Materials Summary */}
      <Card className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-bold font-['Space_Grotesk'] text-foreground mb-4">🧱 Material Requirements</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <MaterialCard label="Cement" value={`${materials.cement.toLocaleString()}`} unit="bags" />
          <MaterialCard label="Steel" value={`${materials.steel}`} unit="tons" />
          <MaterialCard label="Sand" value={`${materials.sand.toLocaleString()}`} unit="cu.ft" />
          <MaterialCard label="Aggregate" value={`${materials.aggregate.toLocaleString()}`} unit="cu.ft" />
          <MaterialCard label="Bricks" value={`${materials.bricks.toLocaleString()}`} unit="units" />
          <MaterialCard label="Water" value={`${materials.water.toLocaleString()}`} unit="liters" />
        </div>
      </Card>
    </div>
  );
}

function SummaryCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card className="glass-card rounded-xl p-4">
      <div className="flex items-center gap-2 text-primary mb-1">{icon}<span className="text-xs text-muted-foreground">{label}</span></div>
      <div className="text-xl md:text-2xl font-bold text-foreground">{value}</div>
    </Card>
  );
}

function MaterialCard({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="bg-muted/50 rounded-lg p-3 text-center">
      <div className="text-lg font-bold text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground">{unit}</div>
      <div className="text-xs font-medium text-primary mt-1">{label}</div>
    </div>
  );
}
