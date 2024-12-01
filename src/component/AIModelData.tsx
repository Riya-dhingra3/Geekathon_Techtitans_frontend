import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

interface AIModelDataProps {
  repo_url: string;
}

const AIModelData: React.FC<AIModelDataProps> = ({ repo_url }) => {
  //   const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [analysis, setAnalysis] = useState<any>({});
  useEffect(() => {
    const fetchDataAman = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://code-analysis-backend.onrender.com/analyze",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              repo_url: repo_url,
              question: "",
            }),
          }
        );

        const data = await response.json();
        console.log(data);
        setAnalysis(data);
        setResponse(data);
        console.log("data insight", data.ai_insights.analysis);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataAman();
  }, [repo_url]);

  return (
    <div className="w-full rounded-[8px] p-2 px-4 bg-[#1D232C] border-none">
      {loading ? (
        <Card className="border-none h-[800px] w-full bg-[#1D232C]">
          <CardContent className="flex h-[400px] w-full border-none flex-col gap-4 p-8 items-start justify-start h-full">
            <div className="font-[700] text-[#C9D1D9] text-[18px]">
              AI Analyzing your code
            </div>
            <Skeleton className="w-full bg-[#FFFFFF]/10 h-[5%] rounded-[8px]" />
            <Skeleton className="w-full bg-[#FFFFFF]/10 h-[5%] rounded-[8px]" />
            <Skeleton className="w-full bg-[#FFFFFF]/10 h-[5%] rounded-[8px]" />
            <Skeleton className="w-full bg-[#FFFFFF]/10 h-[5%] rounded-[8px]" />
            <Skeleton className="w-full bg-[#FFFFFF]/10 h-[5%] rounded-[8px]" />
            <Skeleton className="w-full bg-[#FFFFFF]/10 h-[5%] rounded-[8px]" />
          </CardContent>
        </Card>
      ) : (
        <>
          {response && analysis && (
            <div className="flex items-center justify-center gap-1 mt-4 text-[16px] flex-col  text-[#C9D1D9]/80">
              <div className="font-[700] text-[#C9D1D9] text-[18px]">
                AI Analysis
              </div>
              <p>{analysis.ai_insights.analysis}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AIModelData;
