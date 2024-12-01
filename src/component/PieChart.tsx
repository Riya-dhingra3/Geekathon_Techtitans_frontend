import {
  PieChart as RechartsChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
interface PieChartProps {
  data: {
    [key: string]: number;
  };
}
const PieChart: React.FC<PieChartProps> = ({ data }) => {
  const COLORS = ["#4A90E2", "#E25C5C", "#F5A623", "#7E57C2", "#66BB6A"];
  const chartData = Object.entries(data).map(([name, value]) => ({
    name,
    value,
    label: `${value}`, // Add the value as a label
  }));
  return (
    <div className="w-full flex flex-col rounded-[8px]  bg-[#1D232C] h-[385px] items-center">
      <h1 className="text-[#C9D1D9] font-[700]">List of Top Contributors</h1>
      <div className="w-[40vw] -mt-[4px] h-[90%]">
        <ResponsiveContainer>
          <RechartsChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={150}
              fill="#8884D8"
              dataKey="value"
            >
              {chartData.map((index) => (
                <Cell
                  key={`cell-${index.name}`}
                  fill={COLORS[chartData.indexOf(index) % COLORS.length]}
                  stroke="none"
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#1A1A1A",
                border: "none",
                borderRadius: "8px",
                padding: "10px",
              }}
              itemStyle={{ color: "#fff" }}
            />
          </RechartsChart>
        </ResponsiveContainer>
      </div>
      {/* Trending information */}
    </div>
  );
};
export default PieChart;
