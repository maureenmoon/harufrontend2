// src/api/meal.js
import axios from "axios";

const API_BASE_URL = "/api"; // 프록시 사용을 위해 변경

export const fetchMealsByMemberId = async (memberId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/meals/member/${memberId}`
    );
    return response.data;
  } catch (error) {
    console.error("식사 데이터 가져오기 실패:", error);
    throw error;
  }
};

// 🔥 기존 작동하는 API 활용 (특정 날짜)
export const fetchMealsByDate = async (memberId, date) => {
  try {
    const response = await axios.get(
      `/api/meals/modified-date/member/${memberId}?date=${date}`
    );
    return response.data;
  } catch (error) {
    console.error(`${date} 식사 데이터 가져오기 실패:`, error);
    throw error;
  }
};

// 🔥 월별 식사 기록 가져오기 (Record 페이지용)
export const fetchMonthlyMeals = async (memberId, year, month) => {
  try {
    // month는 0-based이므로 1을 더해서 API에 전달
    const response = await axios.get(
      `${API_BASE_URL}/meals/monthly/member/${memberId}?year=${year}&month=${
        month + 1
      }`
    );
    console.log(
      "🔍 월별 API 호출:",
      `${API_BASE_URL}/meals/monthly/member/${memberId}?year=${year}&month=${
        month + 1
      }`
    );
    console.log("🔍 월별 API 응답:", response.data);
    return response.data;
  } catch (error) {
    console.error("월별 식사 데이터 가져오기 실패:", error);
    throw error;
  }
};

// 🔥 특정 날짜 범위의 식사 기록 가져오기 (대안 API)
export const fetchMealsByDateRange = async (memberId, startDate, endDate) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/meals/date-range/member/${memberId}?startDate=${startDate}&endDate=${endDate}`
    );
    console.log(
      "🔍 날짜 범위 API 호출:",
      `${API_BASE_URL}/meals/date-range/member/${memberId}?startDate=${startDate}&endDate=${endDate}`
    );
    console.log("🔍 날짜 범위 API 응답:", response.data);
    return response.data;
  } catch (error) {
    console.error("날짜 범위 식사 데이터 가져오기 실패:", error);
    throw error;
  }
};

// 🔥 기존 API 활용한 월별 데이터 수집 (대안 방법)
export const fetchMonthlyMealsAlternative = async (memberId, year, month) => {
  try {
    console.log("🔍 대안 방법으로 월별 데이터 수집 시작:", year, month + 1);

    // 해당 월의 첫째 날과 마지막 날 계산
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0); // 다음 달 0일 = 이번 달 마지막 날

    const promises = [];
    const allMeals = [];

    // 🔥 방법 1: 전체 멤버 데이터 가져와서 필터링 시도
    try {
      console.log("🔍 전체 멤버 데이터로 시도...");
      const allMemberMeals = await fetchMealsByMemberId(memberId);

      if (allMemberMeals && Array.isArray(allMemberMeals)) {
        const monthlyFiltered = allMemberMeals.filter((meal) => {
          const mealDate = new Date(
            meal.modifiedAt || meal.createDate || meal.createdDate
          );
          return (
            mealDate.getFullYear() === year && mealDate.getMonth() === month
          );
        });

        if (monthlyFiltered.length > 0) {
          console.log(
            "✅ 전체 데이터에서 월별 필터링 성공:",
            monthlyFiltered.length,
            "개"
          );
          return monthlyFiltered;
        }
      }
    } catch (error) {
      console.warn("🚨 전체 멤버 데이터 방법 실패:", error);
    }

    // 🔥 방법 2: 날짜별로 순차 호출 (주요 날짜들만)
    console.log("🔍 주요 날짜별 호출 시도...");
    const sampleDates = [1, 7, 14, 21, 28]; // 월의 대표 날짜들

    for (const day of sampleDates) {
      if (day <= lastDay.getDate()) {
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
          day
        ).padStart(2, "0")}`;
        try {
          const dayMeals = await fetchMealsByDate(memberId, dateStr);
          if (dayMeals && Array.isArray(dayMeals)) {
            allMeals.push(...dayMeals);
          }
        } catch (error) {
          console.warn(`🚨 ${dateStr} 데이터 가져오기 실패:`, error);
        }
      }
    }

    console.log("🔍 대안 방법 수집 결과:", allMeals.length, "개");
    return allMeals;
  } catch (error) {
    console.error("대안 월별 데이터 수집 실패:", error);
    throw error;
  }
};
