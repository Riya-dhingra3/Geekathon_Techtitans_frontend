// import { useEffect, useState } from "react";
// import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Skeleton } from "@/components/ui/skeleton";
// interface ContributorData {
//   name: string;
//   contributions: number;
// }

// interface PullRequestChartProps {
//   repo_url: string;
// }

// export const PullRequestChart: React.FC<PullRequestChartProps> = ({ repo_url }) => {
//   const [contributorData, setContributorData] = useState<ContributorData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(0);
//   const itemsPerPage = 5;

//   useEffect(() => {
//     const fetchPullRequests = async () => {
//       try {
//         const response = await fetch(`https://geekathon-techtitans-backend.onrender.com/api/v1/pull-requests`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({ url: repo_url })
//         });
//         const data = await response.json();
//         console.log('data is',data)
//         // Count contributions per author
//         const contributorCounts: { [key: string]: number } = {};
//         data.pull_requests.forEach((pr: { author: string }) => {
//           if (pr.author) {
//             contributorCounts[pr.author] = (contributorCounts[pr.author] || 0) + 1;
//           }
//         });
//         // Convert to array format for chart
//         const formattedData = Object.entries(contributorCounts)
//           .map(([name, contributions]) => ({
//             name,
//             contributions
//           }))
//           .sort((a, b) => b.contributions - a.contributions);
//         setContributorData(formattedData);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setLoading(false);
//       }
//     };
//     fetchPullRequests();
//   }, []);
//   // Add pagination calculation
//   const paginatedData = contributorData.slice(
//     currentPage * itemsPerPage,
//     (currentPage + 1) * itemsPerPage
//   );
//   const totalPages = Math.ceil(contributorData.length / itemsPerPage);
//   // Calculate the maximum contribution value from all data
//   const maxContribution = Math.max(
//     ...contributorData.map(item => item.contributions)
//   );
//   if (loading) {
//     return (
//       <Card className="border-none flex-1 w-full bg-[#1D232C]">
//         <CardContent className="flex w-full border-none flex-col gap-4 items-start justify-center h-full">
//           <Skeleton className="w-full bg-[#FFFFFF]/10 h-[50%] rounded-[8px]" />
//           <Skeleton className="w-full bg-[#FFFFFF]/10 h-[10%] rounded-[8px]" />
//           <Skeleton className="w-[50%] bg-[#FFFFFF]/10 h-[10%] rounded-[8px]" />
//         </CardContent>
//       </Card>
//     );
//   }
//   return (
//     <Card className="w-full h-[400px] bg-[#1D232C] border-none">
//       <CardHeader>
//         <CardTitle className="text-[#C9D1D9]">Pull Request Contributors</CardTitle>
//         <CardDescription className="text-gray-400">
//           Number of pull requests per contributor
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="h-[400px] -ml-[17%] w-[120%]">
//           <ResponsiveContainer width="100%" height="320px">
//             <BarChart
//               data={paginatedData}
//               layout="vertical"
//               margin={{ top: 20, right: 30, left: 40, bottom: 10 }}
//             >
//               <XAxis
//                 type="number"
//                 tick={{ fill: "#FFFFFF" }}
//                 axisLine={{ stroke: '#333333' }}
//                 domain={[0, maxContribution]}
//               />
//               <YAxis
//                 dataKey="name"
//                 type="category"
//                 tick={{ fill: "#FFFFFF" }}
//                 axisLine={{ stroke: '#333333' }}
//                 tickLine={false}
//                 width={150}
//               />
//               <Tooltip
//                 contentStyle={{
//                   backgroundColor: "#000000",
//                   border: "1px solid #333333",
//                   borderRadius: "4px",
//                   padding: "8px",
//                 }}
//                 cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
//               />
//               <Bar
//                 dataKey="contributions"
//                 fill="#3B82F6"  // This is the blue color from the image
//                 radius={[4, 4, 4, 4]}
//                 barSize={30}  // Adjust this value to match the thickness you want
//               />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//         {/* Add pagination controls */}
//         <div className="flex justify-center gap-2 mt-4">
//           <button
//             onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
//             disabled={currentPage === 0}
//             className="px-3 py-1 text-white bg-blue-600 rounded disabled:opacity-50"
//           >
//             Previous
//           </button>
//           <span className="text-white">
//             Page {currentPage + 1} of {totalPages}
//           </span>
//           <button
//             onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
//             disabled={currentPage === totalPages - 1}
//             className="px-3 py-1 text-white bg-blue-600 rounded disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }


import { useEffect, useState } from "react";
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
interface ContributorData {
  name: string;
  contributions: number;
}
export function PullRequestChart({repo_url}:{repo_url:string}): JSX.Element {
  const [contributorData, setContributorData] = useState<ContributorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;
  // const repoUrl = "https://github.com/Yash-srivastav16/Tour-Project";
  useEffect(() => {
    const fetchPullRequests = async () => {
      try {
        const response = await fetch("https://geekathon-techtitans-backend.onrender.com/api/v1/pull-requests", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: repo_url }),
        });
        const data = await response.json();
        // Count contributions per author
        const contributorCounts: { [key: string]: number } = {};
        data.pull_requests.forEach((pr: { author: string }) => {
          if (pr.author) {
            contributorCounts[pr.author] = (contributorCounts[pr.author] || 0) + 1;
          }
        });
        // Convert to array format for chart
        const formattedData = Object.entries(contributorCounts)
          .map(([name, contributions]) => ({
            name,
            contributions
          }))
          .sort((a, b) => b.contributions - a.contributions);
        setContributorData(formattedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchPullRequests();
  }, []);
  // Add pagination calculation
  const paginatedData = contributorData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );
  const totalPages = Math.ceil(contributorData.length / itemsPerPage);
  // Calculate the maximum contribution value from all data
  const maxContribution = Math.max(
    ...contributorData.map(item => item.contributions)
  );
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
  return (
    <Card className="w-full h-[400px] bg-[#1D232C] border-none">
      <CardHeader>
        <CardTitle className="text-white">Pull Request Contributors</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] -ml-[20%] w-[120%]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={paginatedData}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 40, bottom: 10 }}
            >
              <XAxis
                type="number"
                tick={{ fill: "#FFFFFF" }}
                axisLine={{ stroke: '#333333' }}
                domain={[0, maxContribution]}
              />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fill: "#FFFFFF" }}
                axisLine={{ stroke: '#333333' }}
                tickLine={false}
                width={150}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#000000",
                  border: "1px solid #333333",
                  borderRadius: "4px",
                  padding: "8px",
                }}
                cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
              />
              <Bar
                dataKey="contributions"
                fill="#3B82F6"  // This is the blue color from the image
                radius={[4, 4, 4, 4]}
                barSize={30}  // Adjust this value to match the thickness you want
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Add pagination controls */}
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
            className="px-3 py-1 text-white bg-blue-600 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-white">
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
            disabled={currentPage === totalPages - 1}
            className="px-3 py-1 text-white bg-blue-600 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </CardContent>
    </Card>
  );
}