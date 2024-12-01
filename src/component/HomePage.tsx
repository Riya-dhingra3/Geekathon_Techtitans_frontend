import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

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
  const ITEMS_PER_PAGE = 7;
  const navigate = useNavigate();
  const location = useLocation();
  const repoParam = location?.state?.repos as Repository[];
  const repoParamPhoto = location?.state?.photoUrl;
  const [repos] = useState<Repository[] | undefined>(repoParam);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<"name" | "watchers" | "date">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);

  function repoDetails(repo: Repository) {
    navigate("/Dashboard", { state: { repo: repo,repoParamPhoto: repoParamPhoto } });
  }
  function colorDetermine(visibility: string) {
    switch (visibility) {
      case "public":
        return "bg-green-200 text-green-800";
      case "private":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  }
  const filteredRepos = repos?.filter((repo) =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
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
  const totalPages = Math.ceil(
    (sortedAndFilteredRepos?.length || 0) / ITEMS_PER_PAGE
  );
  const paginatedRepos = sortedAndFilteredRepos?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="flex w-full min-h-[100vh] flex-row justify-between bg-[#161B21]">
      <div className="w-[20%] min-h-full p-[1%]">
        <Sidebar />
      </div>
      <div className="min-h-full w-[85%] bg-[#161B21] px-[1%] relative flex flex-col pt-4">
        <div>
          <Header photoUrl={repoParamPhoto} />
        </div>
        <div className="min-h-[100vh] w-[100%] bg-[#161B21] px-[5%] relative">
          <div className="w-full flex items-center justify-center flex-row py-4">
            <div className="w-[50%]">
              <div className="text-[#EEF0F4] text-[19px]">
                Your Repositories
              </div>
            </div>
            <div className="w-full flex flex-row items-center justify-center gap-2">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-[3] flex-2 p-2 rounded bg-gray-800 text-[#BAC4D1] border border-[#FFFFFF]/20 focus:outline-none focus:border-white"
              />
              <div className="relative flex-1 z-[10] flex flex-row gap-2">
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as "name" | "watchers" | "date")
                  }
                  className="flex p-2  rounded bg-gray-800 text-[#EEF0F4] border border-[#FFFFFF]/20 focus:outline-none focus:border-white"
                >
                  <option value="name">Name</option>
                  <option value="watchers">Watchers</option>
                  <option value="date">Date</option>
                </select>
                <button
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                  className="flex-1 p-2 rounded bg-gray-800 text-[#EEF0F4] border border-[#FFFFFF]/20 focus:outline-none focus:border-white"
                >
                  {sortOrder === "asc" ? "↑" : "↓"}
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col h-fit w-full bg-[#1D232C]/3 backdrop-blur-lg rounded-[8px] border-[1px] border-[#FFFFFF]/20 overflow-hidden">
            <div className="flex flex-row w-full bg-[#1D232C] p-4">
              <div className="font-semibold border-[#FFFFFF]/20 text-[18px] text-[#EEF0F4] flex-[3]">
                Repository
              </div>
              <div className="font-semibold text-[18px] text-[#EEF0F4] flex-1">
                Language
              </div>
              <div className="font-semibold text-[18px] text-[#EEF0F4] flex-1">
                Status
              </div>
              <div className="font-semibold text-[18px] text-[#EEF0F4] flex-1">
                Forks
              </div>
              <div className="font-semibold text-[18px] text-[#EEF0F4] flex-1">
                Watchers
              </div>
              <div className="font-semibold text-[18px] text-[#EEF0F4] flex-1">
                Date
              </div>
            </div>
            {paginatedRepos?.map((repo) => (
              <div
                key={repo.id}
                onClick={() => repoDetails(repo)}
                className="w-full h-fit p-4 flex flex-row border-[#FFFFFF]/10 border-t-[1px]"
              >
                <div className="font-bold text-[16px] flex items-center flex-[3] text-[#EEF0F4]">
                  {repo.name}
                </div>
                <div className="font-semibold text-[16px] flex items-center flex-1 text-[#EEF0F4]">
                  {repo.language}
                </div>
                <div className="flex items-center flex-1">
                  <div
                    className={`bg-[#FFFFFF]/15 rounded-[9px] px-2 py-1 w-fit flex   text-[14px] ${colorDetermine(
                      repo.visibility
                    )}`}
                  >
                    {repo.visibility}
                  </div>
                </div>
                <div className="flex items-center flex-1 font-semibold text-[16px] text-[#EEF0F4]">
                  {repo.forks}
                </div>
                <div className="flex items-center flex-1 text-[#EEF0F4] font-semibold">
                  {repo.watchers}
                </div>
                <div className="flex items-center flex-1 text-[#EEF0F4] font-semibold">
                  {new Date(repo.updated_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>
            ))}
          </div>
          {/* Pagination Buttons */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-[#0077E4] text-[#EEF0F4] rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-[#EEF0F4]">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-[#0077E4] text-[#EEF0F4] rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
