import { Card } from '@/components/ui/card';
import { Users, Package, IndianRupee, CalendarDays, HardHat, Hammer, Wrench, Paintbrush, Zap, Droplets, Eye } from 'lucide-react';
import type { ProjectResult } from '@/lib/calculations';
import { formatCurrency } from '@/lib/calculations';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface Props {
  result: ProjectResult;
}

const COST_COLORS = ['hsl(25, 95%, 53%)', 'hsl(168, 70%, 40%)', 'hsl(220, 16%, 45%)'];

export default function ResultsDashboard({ result }: Props) {
  const { workers, totalWorkers, totalLaborDays, materials, cost, timeline } = result;

  const costData = [
    { name: 'Labor', value: cost.labor },
    { name: 'Materials', value: cost.materials },
    { name: 'Overhead', value: cost.overhead },
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
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard icon={<Users className="w-5 h-5" />} label="Total Workers" value={totalWorkers.toString()} />
        <SummaryCard icon={<CalendarDays className="w-5 h-5" />} label="Total Days" value={`${timeline.days}`} />
        <SummaryCard icon={<IndianRupee className="w-5 h-5" />} label="Total Cost" value={formatCurrency(cost.total)} />
        <SummaryCard icon={<Package className="w-5 h-5" />} label="Labor Days" value={totalLaborDays.toLocaleString()} />
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

      {/* Cost & Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cost Breakdown */}
        <Card className="glass-card rounded-xl p-6">
          <h3 className="text-lg font-bold font-['Space_Grotesk'] text-foreground mb-4">💰 Cost Breakdown</h3>
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

      {/* Materials */}
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
