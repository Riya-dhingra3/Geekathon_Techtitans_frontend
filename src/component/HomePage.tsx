import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Add interface for repository type
interface Repository {
  id: number;
  name: string;
  language: string;
  visibility: string;
  forks: number;
  watchers: number;
  updated_at: string;
}

const Home: React.FC = () => {
  const navigate=useNavigate()
  const location = useLocation();
  const repoParam = location?.state?.repos as Repository[];
 
  const [repos] = useState<Repository[] | undefined>(repoParam);
    function repoDetails(repo: unknown){
        navigate('/Analysis',{state: {repo: repo}})
    }
    
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<"name" | "watchers" | "date">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const filteredRepos = repos?.filter((repo) =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  console.log(repos);

  const sortedAndFilteredRepos = filteredRepos?.sort((a, b) => {
    switch (sortBy) {
      case "name":
        return sortOrder === "asc"
          ? a.name.toLowerCase().localeCompare(b.name.toLowerCase())
          : b.name.toLowerCase().localeCompare(a.name.toLowerCase());
      case "watchers":
        return sortOrder === "asc"
          ? Number(a.watchers) - Number(b.watchers)
          : Number(b.watchers) - Number(a.watchers);
      case "date":
        return sortOrder === "asc"
          ? new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()
          : new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-[100vh] bg-[#1E1E1E] px-[10%] relative">
      <div className="w-full flex items-center justify-center flex-row py-4">
        <div className="w-[50%]">
          <div className="text-white text-[18px] font-[800]">Your Repositries</div>
        </div>
      <div className="w-full flex flex-row items-center justify-center gap-2 w-[50%]">
        <input
          type="text"
          placeholder="Search repositories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-[3] flex-2 p-2 rounded bg-[#FFFFFF]/10 text-white border border-[#FFFFFF]/20 focus:outline-none focus:border-white"
        />
        <div className="relative flex-1  z-[10] flex flex-row gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "name" | "watchers" | "date")}
            className="flex-1 p-2 rounded bg-[#FFFFFF]/10 text-white border border-[#FFFFFF]/20 focus:outline-none focus:border-white"
          >
            <option value="name">Name</option>
            <option value="watchers">Watchers</option>
            <option value="date">Date</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="flex-1 p-2 rounded bg-[#FFFFFF]/10 text-white border border-[#FFFFFF]/20 focus:outline-none focus:border-white"
          >
            {sortOrder === "asc" ? "↑" : "↓"}
          </button>
        </div>
      </div>
      </div>
      <div className="blob -top-[200px] -right-[200px]"></div>
      <div className="blob -bottom-[200px] -left-[200px]"></div>
      <div className="flex flex-col h-fit w-full bg-[#FFFFFF]/5 backdrop-blur-lg rounded-[8px] border-[1px] border-[#FFFFFF]/20 overflow-hidden">
        <div className="flex flex-row w-full bg-[#FFFFFF]/10 p-4">
          <div className="font-semibold  border-[#FFFFFF]/20 text-[18px] text-white flex-[3]">
            Repository
          </div>
          <div className=" font-semibold text-[18px] text-white  flex-1">
            Language
          </div>
          <div className=" font-semibold text-[18px] text-white  flex-1">
            Status
          </div>
          <div className="font-semibold text-[18px]  text-white  flex-1">
            Forks
          </div>
          <div className="font-semibold text-[18px] text-white   flex-1">
            Watchers
          </div>
          <div className="font-semibold text-[18px] text-white   flex-1">
            Date
          </div>
        </div>
        {sortedAndFilteredRepos?.map((repo) => (
          <div
          onClick={repoDetails}
            key={repo.id}
            className="w-full h-fit p-4 flex flex-row border-[#FFFFFF]/10 border-t-[1px]"
          >
            <div className="font-bold font-[16px] flex items-center flex-[3] text-white">
              {repo.name}
            </div>
            <div className="font-semibold text-[16px] flex items-center flex-1 text-white">
              {repo.language}
            </div>
            <div className="flex items-center flex-1">
              <div className="bg-[#FFFFFF]/15 rounded-full px-4 py-2 w-fit flex text-white font-semibold text-[16px]">
                {repo.visibility}
              </div>
            </div>
            <div className="flex items-center flex-1 font-semibold text-[16px] text-white">
              {repo.forks}
            </div>
            <div className="flex items-center flex-1 text-white font-semibold">
              {repo.watchers}
            </div>
            <div className="flex items-center flex-1 text-white font-semibold">
              {new Date(repo.updated_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
