//Feature cards
export default function FeatureCard({ title, description }) {
  return (
    <div className="bg-light shadow-md rounded-xl p-6 border border-light hover:shadow-lg transition">
      <h3 className="text-primary text-xl font-semibold">{title}</h3>
      <p className="text-dark mt-2">{description}</p>
    </div>
  );
}
