import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PurBtn from "../../common/PurBtn";
import SubLayout from "../../../layout/SubLayout";
import { issueApi } from "../../../api/issueApi";

function IssueUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useSelector((state) => state.login);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
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

      // Check permissions
      if (data.writer !== user?.nickname && user?.role !== "ADMIN") {
        alert("수정 권한이 없습니다.");
        navigate("/community/issue");
        return;
      }

      setIssue(data);
      setTitle(data.title);
      setContent(data.content);
    } catch (err) {
      console.error("이슈 로딩 실패:", err);
      setError("이슈를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) return null;

  if (loading && !issue) {
    return (
      <div className="w-full max-w-[1020px] mx-auto px-4 sm:px-6">
        <SubLayout to="/community" menu="커뮤니티" label="핫이슈 수정" />
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <div className="text-center text-gray-500">이슈를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  if (error || !issue) {
    return (
      <div className="w-full max-w-[1020px] mx-auto px-4 sm:px-6">
        <SubLayout to="/community" menu="커뮤니티" label="핫이슈 수정" />
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

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      setError("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const updateData = {
        title: title.trim(),
        content: content.trim(),
      };

      await issueApi.updateIssue(id, updateData);
      alert("수정이 완료되었습니다.");
      navigate(`/community/issue/${id}`);
    } catch (err) {
      console.error("이슈 수정 실패:", err);
      setError("수정에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[1020px] mx-auto px-4 sm:px-6">
      <SubLayout to="/community" menu="커뮤니티" label="핫이슈 수정" />

      <div className="mt-6 sm:mt-10 space-y-6">
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-red-600">{error}</div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          {/* 제목 입력 */}
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <label className="block text-sm font-medium mb-2 text-gray-700">
              제목
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-12 rounded-lg border border-gray-200 px-4 bg-gray-50
                focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="제목을 입력해주세요"
            />
          </div>

          {/* 내용 입력 */}
          <div className="p-4 sm:p-6">
            <label className="block text-sm font-medium mb-2 text-gray-700">
              내용
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-[300px] sm:h-[500px] rounded-lg p-4 border border-gray-200 bg-gray-50
                focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              placeholder="내용을 입력해주세요"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={() => navigate(-1)}
            disabled={loading}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50"
          >
            {loading ? "수정 중..." : "수정완료"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default IssueUpdate;
