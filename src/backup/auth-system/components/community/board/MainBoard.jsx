import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import SubLayout from "../../../layout/SubLayout";

function MainBoard() {
  const [posts, setPosts] = useState(() => {
    const stored = localStorage.getItem("posts");
    return stored ? JSON.parse(stored) : [];
  });

  const [searchInput, setSearchInput] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  const handleSearch = () => {
    setSearchKeyword(searchInput.trim());
  };

  useEffect(() => {
    const existing = localStorage.getItem("posts");
    if (!existing) {
      const dummyPosts = [
        {
          id: 1,
          title: "다이어트 정보 공유",
          content: "다이어트 너무 힘들다",
          writer: "홍길동",
          date: "2025. 07. 10",
        },
        {
          id: 2,
          title: "다이어트 팁 나눔",
          content: "물 많이 마시기 중요해요!",
          writer: "김다이어트",
          date: "2025. 07. 11",
        },
      ];
      localStorage.setItem("posts", JSON.stringify(dummyPosts));
    }
  }, []);

  const sortedPosts = [...posts].sort((a, b) => b.id - a.id);
  const filteredPosts = searchKeyword
    ? sortedPosts.filter((post) =>
        post.title.toLowerCase().includes(searchKeyword.toLowerCase())
      )
    : sortedPosts;

  return (
    <div className="w-full max-w-[1020px] mx-auto px-4 sm:px-6">
      <SubLayout to="/community" menu="커뮤니티" label="자유게시판" />
      <div className="mt-6 sm:mt-10 space-y-6">
        {/* 상단 검색 섹션 */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              전체 게시글
            </h2>
            <Link
              to="/community/board/write"
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 
                       transition-colors duration-200 text-sm sm:text-base flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              글쓰기
            </Link>
          </div>
          <SearchBar
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            handleSearch={handleSearch}
          />
        </div>

        {/* 게시글 목록 */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-purple-500 text-white">
                  <th className="hidden sm:table-cell py-4 px-6 text-left w-[10%]">
                    번호
                  </th>
                  <th className="py-4 px-6 text-left w-[50%]">제목</th>
                  <th className="py-4 px-6 text-left w-[20%]">작성자</th>
                  <th className="py-4 px-6 text-left w-[20%]">작성일</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPosts.map((post) => (
                  <tr
                    key={post.id}
                    className="hover:bg-purple-50 transition-colors duration-150"
                  >
                    <td className="hidden sm:table-cell py-4 px-6 text-gray-600">
                      {post.id}
                    </td>
                    <td className="py-4 px-6">
                      <Link
                        to={`/community/board/writeview/${post.id}`}
                        className="text-gray-900 hover:text-purple-600 transition-colors duration-150 line-clamp-1"
                        onClick={() =>
                          localStorage.setItem("selectedPostId", post.id)
                        }
                      >
                        {post.title}
                      </Link>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{post.writer}</td>
                    <td className="py-4 px-6 text-gray-600">{post.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 페이지네이션 */}
        <div className="flex justify-center">
          <div className="join shadow-sm">
            <button className="join-item btn btn-sm bg-white hover:bg-gray-50 text-gray-600">
              «
            </button>
            <button className="join-item btn btn-sm bg-purple-500 text-white hover:bg-purple-600">
              1
            </button>
            <button className="join-item btn btn-sm bg-white hover:bg-gray-50 text-gray-600">
              2
            </button>
            <button className="join-item btn btn-sm bg-white hover:bg-gray-50 text-gray-600">
              3
            </button>
            <button className="join-item btn btn-sm bg-white hover:bg-gray-50 text-gray-600">
              »
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainBoard;
