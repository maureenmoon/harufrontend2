import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PurBtn from "../../common/PurBtn";
import SubLayout from "../../../layout/SubLayout";
import { issueApi } from "../../../api/issueApi";

function IssueWrite() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user, isLoggedIn } = useSelector((state) => state.login);

  // 로그인 및 권한 확인
  useEffect(() => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      navigate("/member/login");
      return;
    }

    if (user?.role !== "ADMIN") {
      alert("관리자만 글을 작성할 수 있습니다.");
      navigate("/community/issue");
      return;
    }
  }, [isLoggedIn, user, navigate]);

  if (!isLoggedIn || user?.role !== "ADMIN") return null;

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      setError("제목과 내용을 모두 작성해주세요.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const issueData = {
        title: title.trim(),
        content: content.trim(),
        reference: reference.trim(),
        writer: user.nickname || "관리자",
      };

      const result = await issueApi.createIssue(issueData);
      alert("핫이슈가 등록되었습니다!");
      navigate(`/community/issue/${result.id}`);
    } catch (err) {
      console.error("이슈 생성 실패:", err);
      setError("이슈 등록에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[1020px] mx-auto px-4 sm:px-6">
      <SubLayout to="/community" menu="커뮤니티" label="핫이슈" />
      <div className="mt-6 sm:mt-10 space-y-6">
        {/* 상단 안내 섹션 */}
        <div className="bg-purple-50 rounded-lg p-4 sm:p-6 border border-purple-100">
          <div className="flex items-center gap-3 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-purple-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <h2 className="font-bold text-gray-900 text-lg sm:text-xl">
              핫이슈 작성하기
            </h2>
          </div>
          <p className="text-purple-700 text-sm sm:text-base"></p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-red-600">{error}</div>
          </div>
        )}

        {/* 입력 폼 섹션 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          {/* 제목 입력 */}
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <label
              className="block text-gray-700 text-sm sm:text-base font-medium mb-2"
              htmlFor="title"
            >
              제목
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력해주세요"
              className="w-full h-12 rounded-lg bg-gray-50 px-4 border border-gray-200 
                       focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                       placeholder-gray-400 transition-colors duration-200"
            />
          </div>

          {/* 참고 URL 입력 */}
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <label
              className="block text-gray-700 text-sm sm:text-base font-medium mb-2"
              htmlFor="reference"
            >
              참고 URL
            </label>
            <input
              id="reference"
              type="url"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="참고할 URL을 입력해주세요 (선택사항)"
              className="w-full h-12 rounded-lg bg-gray-50 px-4 border border-gray-200 
                       focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                       placeholder-gray-400 transition-colors duration-200"
            />
          </div>

          {/* 내용 입력 */}
          <div className="p-4 sm:p-6">
            <label
              className="block text-gray-700 text-sm sm:text-base font-medium mb-2"
              htmlFor="content"
            >
              내용
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 입력하세요"
              className="w-full h-[300px] sm:h-[500px] rounded-lg bg-gray-50 p-4 border border-gray-200
                       focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                       placeholder-gray-400 transition-colors duration-200 resize-none"
            />
          </div>
        </div>

        {/* 하단 버튼 섹션 */}
        <div className="flex justify-between items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            disabled={loading}
            className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 
                     transition-colors duration-200 text-sm sm:text-base disabled:opacity-50"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 rounded-lg bg-purple-500 text-white hover:bg-purple-600 
                     transition-colors duration-200 text-sm sm:text-base disabled:opacity-50"
          >
            {loading ? "저장 중..." : "작성완료"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default IssueWrite;
