// SensorChart — line chart for IoT sensor history
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import EmptyState from "../common/EmptyState";

const COLOR_MAP = {
  temperature: "#E5A000",
  humidity: "#3B82F6",
  weight: "#10B981",
};

const UNIT_MAP = {
  temperature: "°C",
  humidity: "%",
  weight: "kg",
};

const SensorChart = ({ data = [], dataKey, title }) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-card">
        <h3 className="chart-title">{title}</h3>
        <EmptyState
          icon="📊"
          title="No historical data"
          description="Chart data will appear once sensor readings are recorded."
        />
      </div>
    );
  }

  const color = COLOR_MAP[dataKey] || "#E5A000";
  const unit = UNIT_MAP[dataKey] || "";

  const formatted = data.map((d) => ({
    ...d,
    time: d.recordedAt
      ? new Date(d.recordedAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : d.time || "",
  }));

  return (
    <div className="chart-card">
      <h3 className="chart-title">{title}</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={formatted}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0e8d8" />
          <XAxis dataKey="time" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} unit={unit} />
          <Tooltip
            formatter={(val) => [`${val}${unit}`, dataKey]}
            contentStyle={{ borderRadius: 8, fontSize: 12 }}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SensorChart;
