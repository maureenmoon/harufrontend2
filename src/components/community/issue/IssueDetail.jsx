import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import SubLayout from "../../../layout/SubLayout";
import PurBtn from "../../common/PurBtn";
import { issueApi } from "../../../api/issueApi";

function IssueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useSelector((state) => state.login);

  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      navigate("/member/login");
      return;
    }

    loadIssue();
  }, [id, isLoggedIn, navigate]);

  const loadIssue = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await issueApi.getIssueById(id);
      setIssue(data);
    } catch (err) {
      console.error("이슈 로딩 실패:", err);
      setError("이슈를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) {
      return;
    }

    try {
      setLoading(true);
      await issueApi.deleteIssue(id);
      alert("삭제되었습니다.");
      navigate("/community/issue");
    } catch (err) {
      console.error("이슈 삭제 실패:", err);
      alert("삭제에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) return null;

  if (loading) {
    return (
      <div className="w-full max-w-[1020px] mx-auto px-4 sm:px-6">
        <SubLayout to="/community" menu="커뮤니티" label="이슈" />
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <div className="text-center text-gray-500">이슈를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  if (error || !issue) {
    return (
      <div className="w-full max-w-[1020px] mx-auto px-4 sm:px-6">
        <SubLayout to="/community" menu="커뮤니티" label="이슈" />
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-6">
          <div className="text-red-600">
            {error || "이슈를 찾을 수 없습니다."}
          </div>
          <button
            onClick={loadIssue}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  const isAdmin = user?.role === "ADMIN";
  const isWriter = issue.writer === user?.nickname;

  return (
    <div className="w-full max-w-[1020px] mx-auto px-4 sm:px-6">
      <SubLayout to="/community" menu="커뮤니티" label="이슈" />

      <div className="bg-white rounded-lg shadow-sm p-6 mt-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">{issue.title}</h2>
          <p className="text-sm text-gray-500 mb-1">
            작성자: {issue.writer} | 작성일: {issue.date}
          </p>

          {/* Reference URL Information */}
          {issue.reference && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
                <span className="text-sm font-medium text-blue-800">
                  원본 링크
                </span>
              </div>
              <a
                href={issue.reference}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 underline break-all"
              >
                {issue.reference}
              </a>
            </div>
          )}
        </div>

        <hr />

        <div className="whitespace-pre-wrap text-gray-800">{issue.content}</div>

        <hr />

        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/community/issue")}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
            >
              목록으로
            </button>
          </div>

          {isAdmin && (
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/community/issue/update/${issue.id}`)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                수정
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors text-sm"
              >
                {loading ? "삭제중..." : "삭제"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default IssueDetail;
