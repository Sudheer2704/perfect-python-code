export interface ProjectInput {
  area: number; // sq yards
  floors: number;
  buildingType: 'residential' | 'commercial' | 'industrial';
  targetDays?: number;
}

export interface WorkerBreakdown {
  masons: number;
  helpers: number;
  steelWorkers: number;
  carpenters: number;
  plumbers: number;
  electricians: number;
  painters: number;
  supervisors: number;
}

export interface MaterialEstimate {
  cement: number; // bags
  steel: number; // tons
  sand: number; // cubic feet
  aggregate: number; // cubic feet
  bricks: number; // units
  water: number; // liters
}

export interface CostBreakdown {
  labor: number;
  materials: number;
  overhead: number;
  total: number;
}

export interface TimelineEstimate {
  days: number;
  weeks: number;
  months: number;
  phases: { name: string; days: number; percentage: number }[];
}

export interface ProjectResult {
  workers: WorkerBreakdown;
  totalWorkers: number;
  totalLaborDays: number;
  materials: MaterialEstimate;
  cost: CostBreakdown;
  timeline: TimelineEstimate;
}

const TYPE_MULTIPLIER = { residential: 1, commercial: 1.3, industrial: 1.5 };

export function calculateProject(input: ProjectInput): ProjectResult {
  const { area, floors, buildingType, targetDays } = input;
  const multiplier = TYPE_MULTIPLIER[buildingType];
  const totalBuiltUp = area * floors * 9; // sq ft approx

  // Workers
  const baseMasons = Math.ceil((totalBuiltUp / 500) * multiplier);
  const workers: WorkerBreakdown = {
    masons: baseMasons,
    helpers: Math.ceil(baseMasons * 1.5),
    steelWorkers: Math.ceil(baseMasons * 0.4),
    carpenters: Math.ceil(baseMasons * 0.3),
    plumbers: Math.ceil(baseMasons * 0.2),
    electricians: Math.ceil(baseMasons * 0.25),
    painters: Math.ceil(baseMasons * 0.3),
    supervisors: Math.max(2, Math.ceil(baseMasons * 0.1)),
  };
  const totalWorkers = Object.values(workers).reduce((a, b) => a + b, 0);

  // Materials
  const materials: MaterialEstimate = {
    cement: Math.ceil(totalBuiltUp * 0.4 * multiplier),
    steel: parseFloat((totalBuiltUp * 0.004 * multiplier).toFixed(2)),
    sand: Math.ceil(totalBuiltUp * 0.6 * multiplier),
    aggregate: Math.ceil(totalBuiltUp * 0.45 * multiplier),
    bricks: Math.ceil(totalBuiltUp * 8 * multiplier),
    water: Math.ceil(totalBuiltUp * 2.5 * multiplier),
  };

  // Timeline
  const baseDays = Math.ceil((totalBuiltUp / 100) * multiplier * (1 + (floors - 1) * 0.15));
  const effectiveDays = targetDays && targetDays < baseDays ? targetDays : baseDays;

  const phases = [
    { name: 'Foundation & Excavation', percentage: 15 },
    { name: 'Structural Framing', percentage: 25 },
    { name: 'Brickwork & Masonry', percentage: 20 },
    { name: 'Plumbing & Electrical', percentage: 15 },
    { name: 'Plastering & Flooring', percentage: 15 },
    { name: 'Finishing & Painting', percentage: 10 },
  ];

  const timeline: TimelineEstimate = {
    days: effectiveDays,
    weeks: parseFloat((effectiveDays / 7).toFixed(1)),
    months: parseFloat((effectiveDays / 30).toFixed(1)),
    phases: phases.map(p => ({
      ...p,
      days: Math.ceil(effectiveDays * (p.percentage / 100)),
    })),
  };

  // Adjust workers if accelerated
  const speedFactor = targetDays && targetDays < baseDays ? baseDays / targetDays : 1;
  if (speedFactor > 1) {
    (Object.keys(workers) as (keyof WorkerBreakdown)[]).forEach(k => {
      workers[k] = Math.ceil(workers[k] * speedFactor);
    });
  }

  const totalLaborDays = totalWorkers * effectiveDays;

  // Cost (INR)
  const laborCost = totalLaborDays * 800;
  const materialCost =
    materials.cement * 400 +
    materials.steel * 65000 +
    materials.sand * 50 +
    materials.aggregate * 55 +
    materials.bricks * 8 +
    materials.water * 0.5;
  const overhead = (laborCost + materialCost) * 0.12;

  const cost: CostBreakdown = {
    labor: Math.round(laborCost),
    materials: Math.round(materialCost),
    overhead: Math.round(overhead),
    total: Math.round(laborCost + materialCost + overhead),
  };

  return {
    workers,
    totalWorkers: Object.values(workers).reduce((a, b) => a + b, 0),
    totalLaborDays,
    materials,
    cost,
    timeline,
  };
}

export function formatCurrency(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
  return `₹${amount.toLocaleString('en-IN')}`;
}
