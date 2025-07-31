import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import SubLayout from "../../../layout/SubLayout";
import { issueApi } from "../../../api/issueApi";

function IssueDelete() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useSelector((state) => state.login);

  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      navigate("/member/login");
      return;
    }

    if (user?.role !== "ADMIN") {
      alert("관리자 권한이 필요합니다.");
      navigate("/community/issue");
      return;
    }

    loadIssue();
  }, [id, isLoggedIn, user, navigate]);

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
    if (
      !window.confirm(
        "정말로 이 이슈를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다."
      )
    ) {
      return;
    }

    try {
      setDeleting(true);
      await issueApi.deleteIssue(id);
      alert("이슈가 삭제되었습니다.");
      navigate("/community/issue");
    } catch (err) {
      console.error("이슈 삭제 실패:", err);
      setError("삭제에 실패했습니다.");
    } finally {
      setDeleting(false);
    }
  };

  if (!isLoggedIn || user?.role !== "ADMIN") return null;

  if (loading) {
    return (
      <div className="w-full max-w-[1020px] mx-auto px-4 sm:px-6">
        <SubLayout to="/community/issue" menu="커뮤니티" label="이슈 삭제" />
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <div className="text-center text-gray-500">이슈를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  if (error || !issue) {
    return (
      <div className="w-full max-w-[1020px] mx-auto px-4 sm:px-6">
        <SubLayout to="/community/issue" menu="커뮤니티" label="이슈 삭제" />
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

  return (
    <div className="w-full max-w-[1020px] mx-auto px-4 sm:px-6">
      <SubLayout to="/community/issue" menu="커뮤니티" label="이슈 삭제" />

      <div className="mt-6 sm:mt-10">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <h2 className="text-xl font-bold text-red-900">이슈 삭제 확인</h2>
          </div>

          <div className="text-red-700 mb-6">
            <p className="mb-2">다음 이슈를 삭제하시겠습니까?</p>
            <div className="bg-white rounded-lg p-4 border border-red-200">
              <h3 className="font-semibold mb-2">{issue.title}</h3>
              <p className="text-sm text-gray-600 mb-2">
                작성자: {issue.writer} | 작성일: {issue.date}
              </p>
              <p className="text-sm text-gray-700 line-clamp-3">
                {issue.content}
              </p>
            </div>
            <p className="mt-4 text-sm font-medium">
              ⚠️ 이 작업은 되돌릴 수 없습니다.
            </p>
          </div>

          <div className="flex justify-end gap-4">
            <button
              onClick={() => navigate(`/community/issue/${id}`)}
              disabled={deleting}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              취소
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
            >
              {deleting ? "삭제 중..." : "삭제"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IssueDelete;
