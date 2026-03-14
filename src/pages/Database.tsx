import { Navbar } from '@/components/layout/Navbar';
import { CollegeDatabase } from '@/components/CollegeDatabase';
import { Footer } from '@/components/landing/Footer';

const Database = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              College Golf Database
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore 1,000+ college golf programs across all divisions. Filter by state, division, and more.
            </p>
          </div>
        </div>
        <CollegeDatabase />
      </main>
      <Footer />
    </div>
  );
};

export default Database;
