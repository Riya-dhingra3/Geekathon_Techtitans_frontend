import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

interface Author {
  login: string;
  email: string;
  contributions: number;
  avatar_url: string;
}

interface ContributorsTableProps {
  contributors: Author[];
  itemsPerPage: number;
}

const ContributorsTable: React.FC<ContributorsTableProps> = ({
  contributors,
  itemsPerPage,
}) => {
  const [currentPage, setCurrentPage] = React.useState(1);

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return contributors.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(contributors.length / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="w-full flex flex-col justify-between p-4 h-[400px] rounded-[12px] bg-[#1D232C]">
      <div>
        <h1 className="text-[#C9D1D9] font-[700]">List of Top Contributors</h1>
        <Table>
          <TableHeader>
            <TableRow className="border-[#FFFFFF]/20">
              <TableHead className="text-[#C9D1D9] font-[500]">
                Avatar
              </TableHead>
              <TableHead className="text-[#C9D1D9] font-[500]">Name</TableHead>
              <TableHead className="text-[#C9D1D9] font-[500]">
                Commits
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {getCurrentPageData().map((author) => (
              <TableRow key={author.email} className="border-[#FFFFFF]/20">
                <TableCell>
                  <img
                    src={author.avatar_url || "/placeholder-avatar.png"}
                    alt={author.login}
                    className="w-8 h-8 rounded-full"
                  />
                </TableCell>
                <TableCell className="text-[#C9D1D9]">{author.login}</TableCell>
                <TableCell className="text-[#C9D1D9]">
                  {author.contributions}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className=" text-[18px]  text-[#C9D1D9] py-1 px-3 border-b border-gray-700 hover:text-sky-400 hover:bg-gray-800 transition-all duration-200 bg-[#0077E4] rounded-[4px] flex justify-center items-center"
      >
        Previous
      </button>
      <span className="px-3 py-1  text-[#C9D1D9]">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className=" text-[18px]  text-[#C9D1D9] py-1 px-3 border-b border-gray-700 hover:text-sky-400 hover:bg-gray-800 transition-all duration-200 bg-[#0077E4] rounded-[4px] flex justify-center items-center"
      >
        Next
      </button>
    </div>
  );
};

export default ContributorsTable;
