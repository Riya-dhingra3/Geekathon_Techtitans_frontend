import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { PullRequestChart } from "./PR_Chaart";
import { Chart } from "./Chart";
import ContributorsTable from "./Table";
import AIModelData from "./AIModelData";
import PieChart from "./PieChart";

interface Author {
  login: string;
  email: string;
  contributions: number;
  avatar_url: string;
}

const Dashboard: React.FC = () => {
  const [contributors, setContributors] = useState<Author[]>([]);
  const itemsPerPage = 3;
  const location = useLocation();
  const repo = location?.state?.repo;
  const repo_url = repo.html_url;
  const repoParamPhoto = location?.state?.repoParamPhoto;
  const languageUrl = repo?.languages_url;
  const [languageData, setLanguageData] = useState<{ [key: string]: number }>(
    {}
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const contributorsResponse = await fetch(`${repo.contributors_url}`);
        const contributorsData = await contributorsResponse.json();
        setContributors(contributorsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    async function fetchLanguages() {
      try {
        // Add GitHub API headers
        const response = await fetch(languageUrl, {
          headers: {
            Accept: "application/json",
            // Add your GitHub token if you have one
            // 'Authorization': `Bearer YOUR_GITHUB_TOKEN`
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Languages data:", data);

        setLanguageData(data);
      } catch (error) {
        console.error("Error details:", error);
      }

      // Log the URL we're trying to fetch
    }
    fetchData();
    fetchLanguages();
  }, [repo, languageUrl]);

  if (contributors.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-white">Loading contributors data...</p>
      </div>
    );
  }

  return (
    <div className="flex w-full min-h-[100vh] bg-[#161B21] flex-row justify-between ">
      <div className="w-[18%] min-h-[150vh] ">
        <Sidebar />
      </div>
      <div className="min-h-full w-[80%] relative flex flex-col pt-4">
        <div>
          <Header photoUrl={repoParamPhoto} />
        </div>
        <div className="flex flex-row gap-2 w-full">
          <div className=" w-[40%] h-[80vh] flex flex-col gap-2">
            <Chart repo_url={repo_url} />

            <PullRequestChart repo_url={repo_url} />
          </div>
          <div className="w-[30%] flex flex-col gap-2">
            <ContributorsTable
              contributors={contributors}
              itemsPerPage={itemsPerPage}
            />
            <PieChart data={languageData} />
          </div>
          <div className="w-[30%] h-[790px] overflow-y-scroll">
            {/* Set fixed height and prevent overflow */}
           
              <AIModelData repo_url={repo_url} />
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
