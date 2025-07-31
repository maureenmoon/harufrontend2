import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { issueApi } from "../../api/issueApi";

function CrawlerAdmin() {
  const { user } = useSelector((state) => state.login);
  const [crawlerStatus, setCrawlerStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Form states
  const [crawlUrl, setCrawlUrl] = useState("");
  const [startNumber, setStartNumber] = useState("");
  const [endNumber, setEndNumber] = useState("");
  const [count, setCount] = useState("5");
  const [delay, setDelay] = useState("1.0");

  // Check if user is admin
  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    if (isAdmin) {
      loadCrawlerStatus();
    }
  }, [isAdmin]);

  const loadCrawlerStatus = async () => {
    try {
      setLoading(true);
      const status = await issueApi.getCrawlerStatus();
      setCrawlerStatus(status);
    } catch (error) {
      console.error("크롤러 상태 로딩 실패:", error);
      setMessage("크롤러 상태를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleCrawlSingle = async () => {
    if (!crawlUrl.trim()) {
      setMessage("URL을 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      const result = await issueApi.crawlSingle(crawlUrl);
      setMessage(`단일 크롤링 완료: ${result.message || "성공"}`);
      setCrawlUrl("");
    } catch (error) {
      setMessage("단일 크롤링 실패: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCrawlRange = async () => {
    if (!startNumber || !endNumber) {
      setMessage("시작 번호와 끝 번호를 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      const result = await issueApi.crawlRange(
        parseInt(startNumber),
        parseInt(endNumber),
        parseFloat(delay)
      );
      setMessage(`범위 크롤링 완료: ${result.message}`);
      setStartNumber("");
      setEndNumber("");
    } catch (error) {
      setMessage("범위 크롤링 실패: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCrawlNext = async () => {
    if (!startNumber) {
      setMessage("현재 번호를 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      const result = await issueApi.crawlNext(
        parseInt(startNumber),
        parseInt(count),
        parseFloat(delay)
      );
      setMessage(`다음 글 크롤링 완료: ${result.message}`);
      setStartNumber("");
    } catch (error) {
      setMessage("다음 글 크롤링 실패: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCrawlPrevious = async () => {
    if (!startNumber) {
      setMessage("현재 번호를 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      const result = await issueApi.crawlPrevious(
        parseInt(startNumber),
        parseInt(count),
        parseFloat(delay)
      );
      setMessage(`이전 글 크롤링 완료: ${result.message}`);
      setStartNumber("");
    } catch (error) {
      setMessage("이전 글 크롤링 실패: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMonthlyCrawl = async () => {
    try {
      setLoading(true);
      setMessage("");
      const result = await issueApi.monthlyCrawl();
      setMessage(`월간 자동 크롤링 완료: ${result.message || "성공"}`);
    } catch (error) {
      setMessage("월간 자동 크롤링 실패: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleManualCrawl = async () => {
    if (!startNumber) {
      setMessage("시작 번호를 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      const result = await issueApi.manualCrawl(
        parseInt(startNumber),
        parseInt(count)
      );
      setMessage(`수동 크롤링 완료: ${result.message}`);
      setStartNumber("");
    } catch (error) {
      setMessage("수동 크롤링 실패: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCleanupOldest = async () => {
    try {
      setLoading(true);
      setMessage("");
      const result = await issueApi.cleanupOldest(parseInt(count));
      setMessage(`오래된 글 정리 완료: ${result.message}`);
    } catch (error) {
      setMessage("오래된 글 정리 실패: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-600">관리자 권한이 필요합니다.</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">크롤러 관리</h3>

      {/* Crawler Status */}
      {crawlerStatus && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-blue-900 mb-2">크롤러 상태</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">마지막 크롤링 번호:</span>{" "}
              {crawlerStatus.last_crawled_number || "없음"}
            </div>
            <div>
              <span className="font-medium">마지막 크롤링 날짜:</span>{" "}
              {crawlerStatus.last_crawl_date || "없음"}
            </div>
            <div>
              <span className="font-medium">다음 크롤링까지:</span>{" "}
              {crawlerStatus.days_until_next_crawl || "알 수 없음"}일
            </div>
            <div>
              <span className="font-medium">월 최대 글 수:</span>{" "}
              {crawlerStatus.max_articles_per_month || "설정 없음"}
            </div>
          </div>
        </div>
      )}

      {/* Message Display */}
      {message && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="text-green-600">{message}</div>
        </div>
      )}

      {/* Single Crawl */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-2">단일 URL 크롤링</h4>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="크롤링할 URL 입력"
            value={crawlUrl}
            onChange={(e) => setCrawlUrl(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleCrawlSingle}
            disabled={loading}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50"
          >
            크롤링
          </button>
        </div>
      </div>

      {/* Range Crawl */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-2">범위 크롤링</h4>
        <div className="grid grid-cols-4 gap-2">
          <input
            type="number"
            placeholder="시작 번호"
            value={startNumber}
            onChange={(e) => setStartNumber(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="number"
            placeholder="끝 번호"
            value={endNumber}
            onChange={(e) => setEndNumber(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="number"
            step="0.1"
            placeholder="지연시간"
            value={delay}
            onChange={(e) => setDelay(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleCrawlRange}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            범위 크롤링
          </button>
        </div>
      </div>

      {/* Next/Previous Crawl */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-2">
          다음/이전 글 크롤링
        </h4>
        <div className="grid grid-cols-4 gap-2">
          <input
            type="number"
            placeholder="현재 번호"
            value={startNumber}
            onChange={(e) => setStartNumber(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="number"
            placeholder="개수"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleCrawlNext}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
          >
            다음 글
          </button>
          <button
            onClick={handleCrawlPrevious}
            disabled={loading}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
          >
            이전 글
          </button>
        </div>
      </div>

      {/* Other Operations */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={handleMonthlyCrawl}
          disabled={loading}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50"
        >
          월간 자동 크롤링
        </button>
        <button
          onClick={handleManualCrawl}
          disabled={loading}
          className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50"
        >
          수동 크롤링
        </button>
        <button
          onClick={handleCleanupOldest}
          disabled={loading}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
        >
          오래된 글 정리
        </button>
        <button
          onClick={loadCrawlerStatus}
          disabled={loading}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50"
        >
          상태 새로고침
        </button>
      </div>

      {loading && (
        <div className="mt-4 text-center text-gray-500">
          작업 중... 잠시만 기다려주세요.
        </div>
      )}
    </div>
  );
}

export default CrawlerAdmin;
