const stats = [
  { value: "50K+", label: "Farmers Onboarded" },
  { value: "95%", label: "Disease Detection Accuracy" },
  { value: "30%", label: "Water Savings" },
  { value: "2x", label: "Income Increase" },
];

const StatsSection = () => {
  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center space-y-1">
              <p className="text-3xl sm:text-4xl font-bold text-primary-foreground">{stat.value}</p>
              <p className="text-sm text-primary-foreground/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
