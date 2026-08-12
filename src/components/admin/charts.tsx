"use client";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  Legend,
} from "recharts";

const COLORS = ["#1A5E47", "#E89B2C", "#C4583B", "#DDB876", "#5DA0D4", "#2E7A5C", "#F5C26B", "#B33A1F", "#A5C8E1", "#1A4A38", "#9E7B3D", "#7BA8C8"];

type StatusDatum = { status: string; _count: number };

export function StatusDistributionChart({ data }: { data: StatusDatum[] }) {
  const total = data.reduce((s, d) => s + d._count, 0);
  if (total === 0) {
    return <EmptyChart label="No nominations yet" />;
  }

  const chartData = data.map((d) => ({
    name: d.status.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()),
    value: d._count,
  }));

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <div className="w-40 h-40">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={70} paddingAngle={2}>
              {chartData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex-1 space-y-1.5 w-full">
        {chartData.map((d, i) => (
          <div key={d.name} className="flex items-center gap-2 text-xs">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: COLORS[i % COLORS.length] }} />
            <span className="flex-1 text-foreground/80">{d.name}</span>
            <span className="font-semibold text-foreground tabular-nums">{d.value}</span>
            <span className="text-muted-foreground text-[10px] tabular-nums w-10 text-right">
              {Math.round((d.value / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

type CategoryDatum = { categoryId: string; _count: number };

export function CategoryDistributionChart({
  data,
  categories,
}: {
  data: CategoryDatum[];
  categories: { id: string; shortName: string }[];
}) {
  const total = data.reduce((s, d) => s + d._count, 0);
  if (total === 0) return <EmptyChart label="No nominations yet" />;

  const chartData = categories.map((c) => ({
    name: c.shortName,
    count: data.find((d) => d.categoryId === c.id)?._count ?? 0,
  }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 20, top: 5, bottom: 5 }}>
          <XAxis type="number" tick={{ fontSize: 10, fill: "#6B6152" }} />
          <YAxis
            type="category"
            dataKey="name"
            width={110}
            tick={{ fontSize: 10, fill: "#2A2419" }}
          />
          <Tooltip
            contentStyle={{
              background: "#FBF7EE",
              border: "1px solid #D9CFB8",
              borderRadius: 12,
              fontSize: 12,
            }}
          />
          <Bar dataKey="count" radius={[0, 6, 6, 0]}>
            {chartData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

type TimeDatum = { date: string; count: number };

export function TimeSeriesChart({ data }: { data: TimeDatum[] }) {
  if (data.every((d) => d.count === 0)) return <EmptyChart label="No submissions in the last 30 days" />;

  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: -10, right: 10, top: 5, bottom: 5 }}>
          <defs>
            <linearGradient id="tsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1A5E47" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#1A5E47" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "#6B6152" }}
            tickFormatter={(d) => d.slice(5)}
            interval={4}
          />
          <YAxis tick={{ fontSize: 10, fill: "#6B6152" }} allowDecimals={false} />
          <Tooltip
            contentStyle={{
              background: "#FBF7EE",
              border: "1px solid #D9CFB8",
              borderRadius: 12,
              fontSize: 12,
            }}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#1A5E47"
            strokeWidth={2}
            fill="url(#tsGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="h-40 grid place-items-center text-sm text-muted-foreground">{label}</div>
  );
}
