import React, { useState } from "react";
import WeightChart from "../../components/haruReport/nutrition/WeightChart";
import CalorieDonutChart from "../../components/haruReport/nutrition/CalorieDonutChart";
import DailyCalorieChart from "../../components/haruReport/nutrition/DailyCalorieChart";
import NutritionBalanceChart from "../../components/haruReport/nutrition/NutritionBalanceChart";
import SubLayout from "../../layout/SubLayout";

const Nutrition = () => {
  // 기간 선택 상태
  const [period, setPeriod] = useState("week"); // 'week' | 'month'

  return (
    <div className="w-full max-w-[1020px] mx-auto px-4 sm:px-6">
      <SubLayout to="/haruReport" menu="리포트" label="영양습관" />
      <div className="mt-6 sm:mt-10 space-y-6">
        {/* 기간 선택 */}
        <div className="mb-4">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="p-1 rounded-md bg-purple-100"
          >
            <option value="week">일주일</option>
            <option value="month">한달</option>
          </select>
        </div>

        {/* 차트 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 1. 체중 변화 차트 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">체중 변화 추이</h2>
            <WeightChart period={period} />
          </div>

          {/* 2. 오늘의 칼로리 차트 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">오늘의 칼로리</h2>
            <CalorieDonutChart />
          </div>

          {/* 3. 일자별 칼로리 섭취 차트 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">일자별 칼로리 섭취량</h2>
            <DailyCalorieChart />
          </div>

          {/* 4. 영양소 밸런스 차트 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">영양소 밸런스</h2>
            <NutritionBalanceChart period={period} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nutrition;
