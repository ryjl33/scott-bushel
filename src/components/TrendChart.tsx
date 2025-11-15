import { HistoricalData } from "@/services/diningData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatTime } from "@/services/diningData";

interface TrendChartProps {
  data: HistoricalData[];
  view: 'hourly' | 'daily' | 'weekly';
}

export const TrendChart = ({ data, view }: TrendChartProps) => {
  const formatXAxis = (value: number) => {
    if (view === 'daily' || view === 'weekly') {
      const item = data.find(d => d.hour === value);
      return item?.day || value.toString();
    }
    return formatTime(value);
  };

  const title = {
    hourly: "Average Hourly Traffic",
    daily: "Weekly Patterns",
    weekly: "Last 7 Days",
  }[view];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="hour"
              tickFormatter={formatXAxis}
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              labelFormatter={(label) => {
                if (view === 'daily' || view === 'weekly') {
                  const item = data.find(d => d.hour === label);
                  return item?.day || label;
                }
                return formatTime(label as number);
              }}
            />
            <Line
              type="monotone"
              dataKey="avgOccupancy"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={{ fill: "hsl(var(--primary))", r: 4 }}
              activeDot={{ r: 6 }}
              name="Avg Occupancy"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
