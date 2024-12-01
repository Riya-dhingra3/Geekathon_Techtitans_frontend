import { useEffect, useState } from "react";
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
interface ChartDataPoint {
  date: string;
  currentWeek: number;
  previousWeek: number;
}
interface Commit {
  date: string;
  message: string;
  author: string;
}
export function Chart({ repo_url }: { repo_url: string }): JSX.Element {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommits = async (): Promise<void> => {
      try {
        const response = await fetch(
          "https://geekathon-techtitans-backend.onrender.com/api/v1/commits",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ url: repo_url }),
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const apiData = await response.json();
        console.log("Raw API Data:", apiData);
        const commits: Commit[] = apiData.commits.map(
          (commit: { date: string | number | Date }) => ({
            ...commit,
            date: new Date(commit.date).toISOString().split("T")[0],
          })
        );
        console.log("Processed Commits:", commits);
        // Get today's date
        const today = new Date();
        // Create arrays for the last 7 days and the previous 7 days
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          return date.toISOString().split("T")[0];
        }).reverse();
        const previous7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date(today);
          date.setDate(today.getDate() - (i + 7));
          return date.toISOString().split("T")[0];
        }).reverse();
        console.log("Last 7 Days:", last7Days);
        console.log("Previous 7 Days:", previous7Days);
        // Create the chart data
        const formattedData = last7Days.map((date, index) => {
          const dayCommits = commits.filter(
            (commit) => commit.date === date
          ).length;
          const previousDayCommits = commits.filter(
            (commit) => commit.date === previous7Days[index]
          ).length;
          console.log(`Processing ${date}:`, {
            dayCommits,
            previousDayCommits,
            matchingCommits: commits.filter((commit) => commit.date === date),
            matchingPreviousCommits: commits.filter(
              (commit) => commit.date === previous7Days[index]
            ),
          });
          return {
            date: new Date(date).toLocaleDateString("en-US", {
              weekday: "short",
            }),
            currentWeek: dayCommits,
            previousWeek: previousDayCommits,
          };
        });
        console.log("Final Formatted Data:", formattedData);
        setChartData(formattedData);
        setLoading(false);
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to fetch commit data");
        setLoading(false);
      }
    };
    fetchCommits();
  }, []);
  if (loading) {
    return (
      <Card className="border-none flex-1 w-full bg-[#1D232C]">
        <CardContent className="flex h-[400px] w-full border-none flex-col gap-4 items-start justify-center">
          <Skeleton className="w-full bg-[#FFFFFF]/10 h-[50%] rounded-[8px]" />
          <Skeleton className="w-full bg-[#FFFFFF]/10 h-[10%] rounded-[8px]" />
          <Skeleton className="w-[50%] bg-[#FFFFFF]/10 h-[10%] rounded-[8px]" />
        </CardContent>
      </Card>
    );
  }
  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-[400px]">
          <div className="text-red-500">{error}</div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="w-full h-[400px] bg-[#1D232C] border-none">
      <CardHeader>
        <CardTitle style={{ color: "#C9D1D9", padding: "4px" }}>
          Commits Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[320px] ">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
            >
              <defs>
                <linearGradient
                  id="currentWeekGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#31A2FF" stopOpacity={0.3} />
                  <stop offset="75%" stopColor="#31A2FF" stopOpacity={0} />
                </linearGradient>
                <linearGradient
                  id="previousWeekGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#B142F5" stopOpacity={0.3} />
                  <stop offset="75%" stopColor="#B142F5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#21262D" />
              <XAxis
                dataKey="date"
                tick={{ fill: "#8B949E" }}
                axisLine={{ stroke: "#21262D" }}
              />
              <YAxis
                tick={{ fill: "#8B949E" }}
                axisLine={{ stroke: "#21262D" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#161B22",
                  border: "1px solid #30363D",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const dataPoint = payload[0].payload;
                    return (
                      <div
                        style={{
                          backgroundColor: "#161B22",
                          padding: "12px",
                          borderRadius: "8px",
                        }}
                      >
                        <p style={{ color: "#C9D1D9", marginBottom: "8px" }}>
                          {dataPoint.fullDate}
                        </p>
                        {payload.map(
                          (entry, index) =>
                            entry.value &&
                            typeof entry.value === "number" &&
                            entry.value > 0 && (
                              <p
                                key={index}
                                style={{
                                  color:
                                    entry.dataKey === "currentWeek"
                                      ? "#31A2FF"
                                      : "#B142F5",
                                  margin: "4px 0",
                                }}
                              >
                                {entry.name}: {entry.value} commits
                              </p>
                            )
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend wrapperStyle={{ color: "#8B949E" }} />
              {/* Areas under the lines */}
              <Area
                type="monotone"
                dataKey="none"
                stroke="none"
                fill="url(#previousWeekGradient)"
                fillOpacity={1}
                stackId="1"
                legendType="none" // This will hide it from the legend
                hide={true} // This will completely hide the element from tooltips
              />
              <Area
                type="monotone"
                dataKey="none"
                stroke="none"
                fill="url(#currentWeekGradient)"
                fillOpacity={1}
                stackId="2"
                legendType="none" // This will hide it from the legend
                hide={true}
              />
              {/* Lines on top */}
              <Line
                type="monotone"
                dataKey="currentWeek"
                stroke="#31A2FF"
                strokeWidth={2}
                dot={false}
                name="Current Week"
              />
              <Line
                type="monotone"
                dataKey="previousWeek"
                stroke="#B142F5"
                strokeWidth={2}
                dot={false}
                name="Previous Week"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter>
        <div style={{ color: "#8B949E" }}>Weekly trends in commit activity</div>
      </CardFooter>
    </Card>
  );
}
