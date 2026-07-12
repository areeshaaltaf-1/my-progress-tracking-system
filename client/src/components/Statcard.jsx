
import "../assets/styles.css";
function StatCard({ title, value, subtitle, color }) {
  return (
    <div className="stat-card">
      <div
        className="card-strip"
        style={{ backgroundColor: color }}
      ></div>

      <h4>{title}</h4>
      <h1 style={{ color }}>{value}</h1>
      <p>{subtitle}</p>
    </div>
  );
}

export default StatCard;