import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SubLayout from "../../layout/SubLayout";
import { searchProfiles } from "../../api/authIssueUserApi/memberApi";

export default function ProfileSearch() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      alert("검색어를 입력해주세요.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await searchProfiles({ query: searchTerm });
      setSearchResults(response.users);
    } catch (error) {
      const message =
        error.response?.data?.message || "프로필 검색에 실패했습니다.";
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[1020px] mx-auto px-4">
      <SubLayout to="/mypage" menu="마이페이지" label="프로필 검색" />

      <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
        <div className="space-y-6">
          {/* Search Input */}
          <div className="flex gap-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="닉네임 또는 이메일로 검색"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "검색 중..." : "검색"}
            </button>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 ? (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">검색 결과</h3>
              <div className="divide-y">
                {searchResults.map((user) => (
                  <div
                    key={user.id}
                    className="py-4 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      {user.photo && (
                        <img
                          src={user.photo}
                          alt={user.nickname}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium">{user.nickname}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/mypage/profile/${user.id}`)}
                      className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
                    >
                      프로필 보기
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : searchTerm && !isLoading ? (
            <div className="text-center py-8 text-gray-500">
              검색 결과가 없습니다.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
