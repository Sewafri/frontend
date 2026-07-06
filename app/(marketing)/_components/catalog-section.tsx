const FEATURES = [
  { title: "Expert-led courses", description: "Learn from professionals with real-world experience in their fields." },
  { title: "African-focused", description: "Content designed for the African context and job market." },
  { title: "Learn at your pace", description: "Self-paced courses that fit around your schedule." },
  { title: "Certificate on completion", description: "Earn recognized certificates to boost your career." },
];

export default function FeaturesSection() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {FEATURES.map((f) => (
        <div key={f.title} className="rounded-lg border border-border-subtle bg-surface-card p-6">
          <h3 className="text-sm font-semibold text-white">{f.title}</h3>
          <p className="mt-1 text-sm text-text-secondary">{f.description}</p>
        </div>
      ))}
    </div>
  );
}
