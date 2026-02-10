export interface ProjectInput {
  area: number; // sq yards
  floors: number;
  buildingType: 'residential' | 'commercial' | 'industrial';
  targetDays?: number;
  // Scenario 3: Customizable rates
  wageRate?: number; // INR per day per worker
  cementRate?: number;
  steelRate?: number;
  sandRate?: number;
  aggregateRate?: number;
  brickRate?: number;
  contingencyPercent?: number;
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
  cement: number;
  steel: number;
  sand: number;
  aggregate: number;
  bricks: number;
  water: number;
}

export interface CostBreakdown {
  labor: number;
  materials: number;
  overhead: number;
  contingency: number;
  total: number;
}

export interface WeeklySchedule {
  week: number;
  phase: string;
  workersNeeded: number;
  keyActivities: string[];
}

export interface ResourceIntensity {
  phase: string;
  workersPerDay: number;
  materialsPerDay: number; // as percentage of total
  intensity: 'Low' | 'Medium' | 'High' | 'Peak';
}

export interface CostAnalysis {
  costPerSqYard: number;
  costPerSqFt: number;
  materialCostBreakdown: { item: string; qty: string; rate: number; total: number }[];
  laborCostPerDay: number;
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
  weeklySchedule: WeeklySchedule[];
  resourceIntensity: ResourceIntensity[];
  costAnalysis: CostAnalysis;
  speedFactor: number;
  isAccelerated: boolean;
}

const TYPE_MULTIPLIER = { residential: 1, commercial: 1.3, industrial: 1.5 };

const DEFAULT_RATES = {
  wage: 800,
  cement: 400,
  steel: 65000,
  sand: 50,
  aggregate: 55,
  brick: 8,
  contingency: 5,
};

export function calculateProject(input: ProjectInput): ProjectResult {
  const { area, floors, buildingType, targetDays } = input;
  const multiplier = TYPE_MULTIPLIER[buildingType];
  const totalBuiltUp = area * floors * 9;

  const wageRate = input.wageRate ?? DEFAULT_RATES.wage;
  const cementRate = input.cementRate ?? DEFAULT_RATES.cement;
  const steelRate = input.steelRate ?? DEFAULT_RATES.steel;
  const sandRate = input.sandRate ?? DEFAULT_RATES.sand;
  const aggregateRate = input.aggregateRate ?? DEFAULT_RATES.aggregate;
  const brickRate = input.brickRate ?? DEFAULT_RATES.brick;
  const contingencyPercent = input.contingencyPercent ?? DEFAULT_RATES.contingency;

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
  const speedFactor = targetDays && targetDays < baseDays ? baseDays / targetDays : 1;
  const isAccelerated = speedFactor > 1;

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
  if (speedFactor > 1) {
    (Object.keys(workers) as (keyof WorkerBreakdown)[]).forEach(k => {
      workers[k] = Math.ceil(workers[k] * speedFactor);
    });
  }

  // Adjust materials for acceleration (wastage increases)
  const adjustedMaterials = { ...materials };
  if (isAccelerated) {
    const wastageMultiplier = 1 + (speedFactor - 1) * 0.05;
    adjustedMaterials.cement = Math.ceil(materials.cement * wastageMultiplier);
    adjustedMaterials.steel = parseFloat((materials.steel * wastageMultiplier).toFixed(2));
    adjustedMaterials.sand = Math.ceil(materials.sand * wastageMultiplier);
    adjustedMaterials.aggregate = Math.ceil(materials.aggregate * wastageMultiplier);
    adjustedMaterials.bricks = Math.ceil(materials.bricks * wastageMultiplier);
    adjustedMaterials.water = Math.ceil(materials.water * wastageMultiplier);
  }

  const totalAdjustedWorkers = Object.values(workers).reduce((a, b) => a + b, 0);
  const totalLaborDays = totalAdjustedWorkers * effectiveDays;

  // Cost (INR) with customizable rates
  const laborCost = totalLaborDays * wageRate;
  const materialCost =
    adjustedMaterials.cement * cementRate +
    adjustedMaterials.steel * steelRate +
    adjustedMaterials.sand * sandRate +
    adjustedMaterials.aggregate * aggregateRate +
    adjustedMaterials.bricks * brickRate +
    adjustedMaterials.water * 0.5;
  const overhead = (laborCost + materialCost) * 0.12;
  const contingency = (laborCost + materialCost + overhead) * (contingencyPercent / 100);

  const cost: CostBreakdown = {
    labor: Math.round(laborCost),
    materials: Math.round(materialCost),
    overhead: Math.round(overhead),
    contingency: Math.round(contingency),
    total: Math.round(laborCost + materialCost + overhead + contingency),
  };

  // Scenario 2: Weekly Schedule
  const weeklySchedule: WeeklySchedule[] = [];
  const totalWeeks = Math.ceil(effectiveDays / 7);
  const phaseActivities: Record<string, string[]> = {
    'Foundation & Excavation': ['Site clearing', 'Excavation', 'PCC & footing', 'Foundation walls'],
    'Structural Framing': ['Column casting', 'Beam layout', 'Slab reinforcement', 'Concrete pouring'],
    'Brickwork & Masonry': ['Wall construction', 'Lintel placement', 'Partition walls', 'Curing'],
    'Plumbing & Electrical': ['Pipe laying', 'Wiring conduits', 'Fixture rough-in', 'Panel installation'],
    'Plastering & Flooring': ['Internal plaster', 'External plaster', 'Tile laying', 'Floor finishing'],
    'Finishing & Painting': ['Primer coat', 'Final paint', 'Hardware fitting', 'Cleanup & handover'],
  };

  let accumulatedWeeks = 0;
  for (const phase of timeline.phases) {
    const phaseWeeks = Math.max(1, Math.ceil(phase.days / 7));
    const activities = phaseActivities[phase.name] || [];
    for (let w = 0; w < phaseWeeks; w++) {
      const weekNum = accumulatedWeeks + w + 1;
      if (weekNum > totalWeeks) break;
      const intensityRatio = phase.name.includes('Structural') || phase.name.includes('Brickwork') ? 1.0 : 0.7;
      weeklySchedule.push({
        week: weekNum,
        phase: phase.name,
        workersNeeded: Math.ceil(totalAdjustedWorkers * intensityRatio),
        keyActivities: activities.slice(w * 2, w * 2 + 2).length > 0 ? activities.slice(w * 2, w * 2 + 2) : [activities[activities.length - 1]],
      });
    }
    accumulatedWeeks += phaseWeeks;
  }

  // Scenario 2: Resource Intensity
  const resourceIntensity: ResourceIntensity[] = timeline.phases.map(p => {
    const intensityLevel: ResourceIntensity['intensity'] =
      p.percentage >= 25 ? 'Peak' :
      p.percentage >= 20 ? 'High' :
      p.percentage >= 15 ? 'Medium' : 'Low';
    return {
      phase: p.name,
      workersPerDay: Math.ceil(totalAdjustedWorkers * (p.percentage / 25)),
      materialsPerDay: parseFloat(((p.percentage / effectiveDays) * 100).toFixed(1)),
      intensity: intensityLevel,
    };
  });

  // Scenario 3: Cost Analysis
  const costAnalysis: CostAnalysis = {
    costPerSqYard: Math.round(cost.total / area),
    costPerSqFt: Math.round(cost.total / totalBuiltUp),
    laborCostPerDay: Math.round(laborCost / effectiveDays),
    materialCostBreakdown: [
      { item: 'Cement', qty: `${adjustedMaterials.cement.toLocaleString()} bags`, rate: cementRate, total: adjustedMaterials.cement * cementRate },
      { item: 'Steel', qty: `${adjustedMaterials.steel} tons`, rate: steelRate, total: Math.round(adjustedMaterials.steel * steelRate) },
      { item: 'Sand', qty: `${adjustedMaterials.sand.toLocaleString()} cu.ft`, rate: sandRate, total: adjustedMaterials.sand * sandRate },
      { item: 'Aggregate', qty: `${adjustedMaterials.aggregate.toLocaleString()} cu.ft`, rate: aggregateRate, total: adjustedMaterials.aggregate * aggregateRate },
      { item: 'Bricks', qty: `${adjustedMaterials.bricks.toLocaleString()} units`, rate: brickRate, total: adjustedMaterials.bricks * brickRate },
      { item: 'Water', qty: `${adjustedMaterials.water.toLocaleString()} L`, rate: 0.5, total: Math.round(adjustedMaterials.water * 0.5) },
    ],
  };

  return {
    workers,
    totalWorkers: totalAdjustedWorkers,
    totalLaborDays,
    materials: adjustedMaterials,
    cost,
    timeline,
    weeklySchedule,
    resourceIntensity,
    costAnalysis,
    speedFactor,
    isAccelerated,
  };
}

export function formatCurrency(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
  return `₹${amount.toLocaleString('en-IN')}`;
}
