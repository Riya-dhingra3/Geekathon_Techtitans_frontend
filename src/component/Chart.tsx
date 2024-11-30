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
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

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
  

export function Chart(): JSX.Element {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const repoUrl = "https://github.com/PranavAvasthi/LeetCode-Cpp";

  useEffect(() => {
    const fetchCommits = async (): Promise<void> => {
      try {
        const response = await fetch("https://geekathon-techtitans-backend.onrender.com/api/v1/commits", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: repoUrl }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const apiData = await response.json();
        console.log("Raw API Data:", apiData);

        const commits: Commit[] = apiData.commits.map((commit: { date: string | number | Date; }) => ({
            ...commit,
            date: new Date(commit.date).toISOString().split('T')[0]
          }));
        
        console.log("Processed Commits:", commits);

        // Get today's date
        const today = new Date("2022-09-02");
        
        // Create arrays for the last 7 days and the previous 7 days
        const last7Days = Array.from({length: 7}, (_, i) => {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          return date.toISOString().split('T')[0];
        }).reverse();

        const previous7Days = Array.from({length: 7}, (_, i) => {
          const date = new Date(today);
          date.setDate(today.getDate() - (i + 7));
          return date.toISOString().split('T')[0];
        }).reverse();

        console.log("Last 7 Days:", last7Days);
        console.log("Previous 7 Days:", previous7Days);

        // Create the chart data
        const formattedData = last7Days.map((date, index) => {
          const dayCommits = commits.filter(commit => commit.date === date).length;
          const previousDayCommits = commits.filter(commit => commit.date === previous7Days[index]).length;

          console.log(`Processing ${date}:`, {
            dayCommits,
            previousDayCommits,
            matchingCommits: commits.filter(commit => commit.date === date),
            matchingPreviousCommits: commits.filter(commit => commit.date === previous7Days[index])
          });

          return {
            date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
            currentWeek: dayCommits,
            previousWeek: previousDayCommits
          };
        });

        console.log("Final Formatted Data:", formattedData);

        setChartData(formattedData);
        setLoading(false);
      } catch (err) {
        console.error('Error:', err);
        setError("Failed to fetch commit data");
        setLoading(false);
      }
    };

    fetchCommits();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-[400px]">
          <div className="animate-spin">Loading...</div>
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
    <Card style={{ background: "linear-gradient(to bottom, #0d1117, #161b22)" }}>
      <CardHeader>
        <CardTitle style={{ color: "#c9d1d9" }}>Commits Overview</CardTitle>
        <CardDescription style={{ color: "#8b949e" }}>
          Comparing commits between current and previous weeks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart 
              data={chartData} 
              margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
            >
              <defs>
                <linearGradient id="currentWeekGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#31a2ff" stopOpacity={0.3} />
                  <stop offset="75%" stopColor="#31a2ff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="previousWeekGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#b142f5" stopOpacity={0.3} />
                  <stop offset="75%" stopColor="#b142f5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#21262d" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: "#8b949e" }}
                axisLine={{ stroke: '#21262d' }}
              />
              <YAxis 
                tick={{ fill: "#8b949e" }}
                axisLine={{ stroke: '#21262d' }}
              />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: "#161b22", 
                  border: "1px solid #30363d", 
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                }}
                content={({ active, payload}) => {
                  if (active && payload && payload.length) {
                    const dataPoint = payload[0].payload;
                    return (
                      <div style={{ 
                        backgroundColor: "#161b22", 
                        padding: "12px",
                        borderRadius: "8px",
                      }}>
                        <p style={{ color: "#c9d1d9", marginBottom: "8px" }}>{dataPoint.fullDate}</p>
                        {payload.map((entry, index) => (
                          entry.value && typeof entry.value === 'number' && entry.value > 0 && (
                            <p 
                              key={index} 
                              style={{ 
                                color: entry.dataKey === 'currentWeek' ? '#31a2ff' : '#b142f5',
                                margin: "4px 0"
                              }}
                            >
                              {entry.name}: {entry.value} commits
                            </p>
                          )
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend 
                wrapperStyle={{ color: "#8b949e" }}
              />
              {/* Areas under the lines */}
              <Area
                type="monotone"
                dataKey="previousWeek"
                stroke="none"
                fill="url(#previousWeekGradient)"
                fillOpacity={1}
                stackId="1"
              />
              <Area
                type="monotone"
                dataKey="currentWeek"
                stroke="none"
                fill="url(#currentWeekGradient)"
                fillOpacity={1}
                stackId="2"
              />
              {/* Lines on top */}
              <Line
                type="monotone"
                dataKey="currentWeek"
                stroke="#31a2ff"
                strokeWidth={2}
                dot={false}
                name="Current Week"
              />
              <Line
                type="monotone"
                dataKey="previousWeek"
                stroke="#b142f5"
                strokeWidth={2}
                dot={false}
                name="Previous Week"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter>
        <div style={{ color: "#8b949e" }}>Weekly trends in commit activity</div>
      </CardFooter>
    </Card>
  );
}
