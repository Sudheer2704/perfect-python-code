import { useState } from 'react';
import { Building2, Cpu } from 'lucide-react';
import ProjectForm from '@/components/ProjectForm';
import ResultsDashboard from '@/components/ResultsDashboard';
import { calculateProject, type ProjectInput, type ProjectResult } from '@/lib/calculations';

const Index = () => {
  const [result, setResult] = useState<ProjectResult | null>(null);

  const handleSubmit = (input: ProjectInput) => {
    const res = calculateProject(input);
    setResult(res);
    setTimeout(() => {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="gradient-hero text-primary-foreground py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-full px-4 py-1.5 text-sm mb-6">
            <Cpu className="w-4 h-4" /> AI-Powered Construction Planner
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-['Space_Grotesk'] leading-tight mb-4">
            Smart<span className="text-gradient">Build</span> AI
          </h1>
          <p className="text-lg text-primary-foreground/70 max-w-xl mx-auto">
            Analyze building complexity, estimate workforce, materials, costs, and timelines — all powered by intelligent calculations.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 -mt-8 pb-16 space-y-8">
        <ProjectForm onSubmit={handleSubmit} />

        {result && (
          <div id="results">
            <ResultsDashboard result={result} />
          </div>
        )}

        {!result && (
          <div className="text-center py-16 text-muted-foreground">
            <Building2 className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg">Enter your project details above to generate a comprehensive plan</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        SmartBuild AI — Intelligent Construction Planning System
      </footer>
    </div>
  );
};

export default Index;
