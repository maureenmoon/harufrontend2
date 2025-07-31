import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import SubLayout from "../../layout/SubLayout";
import SearchBar from "../../components/common/SearchBar";
import ChatBot from "../../components/chatbot/ChatBot";
import { issueApi } from "../../api/issueApi";
import CrawlerAdmin from "../../components/admin/CrawlerAdmin";

function Issue() {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useSelector((state) => state.login);

  const [issues, setIssues] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 12;

  // Load issues from API
  const loadIssues = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await issueApi.getAllIssues();
      setIssues(data);
      setFilteredIssues(data);
    } catch (err) {
      console.error("이슈 로딩 실패:", err);
      setError("이슈를 불러오는데 실패했습니다.");
      // Fallback to dummy data if API fails
      const dummyIssues = [
        {
          id: 1,
          title: "사이트 버그 제보",
          content: "모바일 화면 깨짐 현상 발생",
          writer: "toby",
          date: "2025.07.15",
        },
        {
          id: 2,
          title: "기능 요청",
          content: "검색 기능이 있으면 좋겠어요",
          writer: "관리자",
          date: "2025.07.16",
        },
      ];
      setIssues(dummyIssues);
      setFilteredIssues(dummyIssues);
    } finally {
      setLoading(false);
    }
  };

  // Redirect if not logged in and load issues
  useEffect(() => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다");
      navigate("/member/login");
      return;
    }

    loadIssues();
  }, [isLoggedIn, navigate]);

  const handleSearch = (keyword) => {
    const lowerKeyword = keyword.trim().toLowerCase();
    const filtered = issues.filter((issue) =>
      issue.title.toLowerCase().includes(lowerKeyword)
    );
    setFilteredIssues(filtered);
    setCurrentPage(1);
  };

  if (!user) return null;
  const isAdmin = user?.role === "ADMIN";

  const sorted = [...filteredIssues].sort((a, b) => b.id - a.id);
  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const paginated = sorted.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Responsive pagination component
  const Pagination = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (isMobile) {
      // Mobile pagination - simple prev/next with page info
      return (
        <div className="flex justify-center items-center gap-3 py-4">
          <button
            className="px-4 py-2 bg-purple-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            이전
          </button>
          <span className="text-sm text-gray-600 px-3 py-2 bg-gray-100 rounded-lg">
            {currentPage} / {totalPages}
          </span>
          <button
            className="px-4 py-2 bg-purple-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            다음
          </button>
        </div>
      );
    } else {
      // Desktop pagination - with page numbers
      const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);

        if (end - start + 1 < maxVisible) {
          start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
          pages.push(i);
        }
        return pages;
      };

      return (
        <div className="flex justify-center items-center gap-2 py-6">
          <button
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            이전
          </button>

          {getPageNumbers().map((page) => (
            <button
              key={page}
              className={`px-3 py-2 rounded-lg text-sm ${
                page === currentPage
                  ? "bg-purple-500 text-white"
                  : "border border-gray-300 hover:bg-gray-50"
              }`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}

          <button
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            다음
          </button>
        </div>
      );
    }
  };

  return (
    <div className="w-full max-w-[1020px] mx-auto px-4 sm:px-6">
      <SubLayout to="/community" menu="커뮤니티" label="이슈" />

      <div className="mt-6 sm:mt-10 space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              전체 이슈
            </h2>
            {isAdmin && (
              <Link
                to="/community/issue/write"
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 text-sm sm:text-base transition-colors"
              >
                글쓰기
              </Link>
            )}
          </div>
          <SearchBar onSearch={handleSearch} />
        </div>

        {loading && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="text-gray-500">이슈를 불러오는 중...</div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-red-600">{error}</div>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-purple-500 text-white">
                    <th className="py-4 px-6 text-left w-[50%]">제목</th>
                    <th className="py-4 px-6 text-left w-[25%]">작성자</th>
                    <th className="py-4 px-6 text-left w-[25%]">작성일</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginated.map((issue) => (
                    <tr
                      key={issue.id}
                      className="hover:bg-purple-50 transition-colors duration-150"
                    >
                      <td className="py-4 px-6">
                        <Link
                          to={`/community/issue/${issue.id}`}
                          className="text-gray-900 hover:text-purple-600 line-clamp-1"
                        >
                          {issue.title}
                        </Link>
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        <span className="font-medium">{issue.writer}</span>
                      </td>
                      <td className="py-4 px-6 text-gray-600">{issue.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {paginated.map((issue) => (
                <div
                  key={issue.id}
                  className="bg-white rounded-lg shadow-sm p-4 border border-gray-100"
                >
                  <div className="flex justify-between items-start mb-2">
                    <Link
                      to={`/community/issue/${issue.id}`}
                      className="text-gray-900 font-medium line-clamp-2 flex-1 mr-2"
                    >
                      {issue.title}
                    </Link>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span className="font-medium">{issue.writer}</span>
                    <span>{issue.date}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && <Pagination />}
          </>
        )}
      </div>

      {/* 챗봇 추가 */}
      <ChatBot />

      {/* Admin Panel */}
      {isAdmin && (
        <div className="mt-8">
          <CrawlerAdmin />
        </div>
      )}
    </div>
  );
}

export default Issue;
