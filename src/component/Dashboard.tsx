import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Author {
  login: string;
  email: string;
  contributions: number;
  avatar_url: string;
}

interface Commit {
  hash: string;
  author: string;
  author_email: string;
  date: string;
  message: string;
  lines_changed: number;
}

interface CommitData {
  repository_url: string;
  commits: Commit[];
  authors: Author[];
}

const Dashboard: React.FC = () => {
  const [commitData, setCommitData] = useState<CommitData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const contributorsResponse = await fetch(
          "https://api.github.com/repos/Yash-srivastav16/Tour-Project/contributors"
        );
        const contributors = await contributorsResponse.json();
        // TODO: Add proper data transformation here
        setCommitData({
          repository_url: "https://github.com/Yash-srivastav16/Tour-Project",
          authors: contributors,
          commits: [] // Add commits fetching logic
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const getCurrentPageData = () => {
    if (!commitData) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return commitData.authors.slice(startIndex, endIndex);
  };

  const totalPages = commitData ? Math.ceil(commitData.authors.length / itemsPerPage) : 0;

  if (!commitData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-white">Loading commit data...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="space-y-8">
        <h2 className="text-xl font-bold mb-4">Repository Summary</h2>
        
        <Table>
          <TableCaption>List of all contributors to this repository</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Avatar</TableHead>
              <TableHead>Name</TableHead>
           
              <TableHead className="text-right">Commits</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {getCurrentPageData().map((author) => (
              <TableRow key={author.email}>
                <TableCell>
                  <img
                    src={author.avatar_url || "/placeholder-avatar.png"}
                    alt={author.login}
                    className="w-8 h-8 rounded-full"
                  />
                </TableCell>
                <TableCell className="font-medium">{author.login}</TableCell>
                <TableCell className="text-right">
                  {author.contributions}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          
          <span className="px-3 py-1">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>

        <div className="space-y-4">
          {commitData.commits.map((commit) => (
            <div key={commit.hash} className="bg-[#2D333B] p-4 rounded">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-mono text-sm text-gray-400">
                    {commit.hash.substring(0, 7)}
                  </p>
                  <p className="font-semibold">{commit.message}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">
                    {new Date(commit.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-400">
                    {commit.lines_changed} lines changed
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

