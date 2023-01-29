export interface DashboardStatCardProps {
  title: string;
  count: number;
  icon?: JSX.Element;
}

export default function DashboardStatCard({ title, count, icon }: DashboardStatCardProps) {
  return (
    <div className="stat">
      {icon && <div className="stat-figure text-primary">{icon}</div>}

      <div className="stat-title">{title}</div>
      <div className="stat-value text-primary">{count}</div>
    </div>
  );
}
