// src/pages/meal/Meal.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setSelectedDate,
  setMealRecords,
  setNutritionTotals,
  setLoading,
  setError,
  clearError,
} from "../../slices/mealSlice";
import axios from "axios";
import MealPickerModal from "../../components/meal/MealPickerModal";
import MealCard from "../../components/haruReport/record/MealCard";
import SubLayout from "../../layout/SubLayout";

function Meal() {
  const dispatch = useDispatch();

  // ✅ Redux에서 상태 가져오기
  const {
    selectedDate,
    mealRecords,
    totalKcal,
    totalCarbs,
    totalProtein,
    totalFat,
    isLoading,
    error,
  } = useSelector((state) => state.meal);

  const [isMealPickerOpen, setIsMealPickerOpen] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState("");

  // 목표 칼로리 (임시로 2000으로 설정)
  const calorieGoal = 2000;

  console.log("🔍 Meal.jsx - Redux selectedDate:", selectedDate);
  console.log("🔍 Meal.jsx - Redux mealRecords:", mealRecords);
  console.log("🔍 Meal.jsx - Redux 영양소:", {
    totalKcal,
    totalCarbs,
    totalProtein,
    totalFat,
  });

  // 날짜 변경 함수
  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    const newDateString = newDate.toISOString().slice(0, 10);
    dispatch(setSelectedDate(newDateString));
    console.log("🔍 날짜 변경:", newDateString);
  };

  // 카드 클릭 핸들러
  const handleCardClick = (record) => {
    console.log("카드 클릭:", record);
    // 필요시 상세 보기 모달 등을 열 수 있습니다
  };

  // 식사 기록 불러오기 함수
  const loadMeals = useCallback(async () => {
    const memberId = 1; // 임시로 하드코딩

    dispatch(setLoading(true));
    dispatch(clearError());
    console.log("🔍 식사 기록 로드 시작 - 날짜:", selectedDate);

    try {
      const response = await axios.get(
        `/api/meals/modified-date/member/${memberId}?date=${selectedDate}`
      );

      console.log("🔍 API 응답:", response.data);

      if (response.data) {
        // 데이터 가공
        const processedData = Array.isArray(response.data)
          ? response.data
          : response.data.data || [];

        const transformedData = processedData.map((record) => {
          console.log("🔍 개별 record 가공:", record);

          // mealType → type 변환
          const convertMealType = (mealType) => {
            const typeMap = {
              BREAKFAST: "아침",
              LUNCH: "점심",
              DINNER: "저녁",
              SNACK: "간식",
            };
            return typeMap[mealType] || mealType;
          };

          // 영양소 계산
          let recordCalories = 0;
          let recordCarbs = 0;
          let recordProtein = 0;
          let recordFat = 0;

          if (record.foods && Array.isArray(record.foods)) {
            record.foods.forEach((food) => {
              recordCalories += food.calories || 0;
              recordCarbs += food.carbs || 0;
              recordProtein += food.protein || 0;
              recordFat += food.fat || 0;
            });
          }

          // 🔥 modifiedAt 우선으로 날짜 필드 설정
          const dateField =
            record.modifiedAt ||
            record.createDate ||
            record.createdDate ||
            record.date;

          return {
            ...record,
            type: convertMealType(record.mealType),
            createDate: dateField,
            modifiedAt: record.modifiedAt,
            totalKcal: recordCalories,
            calories: recordCalories,
          };
        });

        console.log("🔍 가공된 데이터:", transformedData);

        // Redux에 저장
        dispatch(setMealRecords(transformedData));

        // 전체 영양소 계산
        const totalCalories = transformedData.reduce(
          (sum, record) => sum + (record.totalKcal || 0),
          0
        );
        const totalCarbsSum = transformedData.reduce((sum, record) => {
          return (
            sum +
            (record.foods
              ? record.foods.reduce(
                  (foodSum, food) => foodSum + (food.carbs || 0),
                  0
                )
              : 0)
          );
        }, 0);
        const totalProteinSum = transformedData.reduce((sum, record) => {
          return (
            sum +
            (record.foods
              ? record.foods.reduce(
                  (foodSum, food) => foodSum + (food.protein || 0),
                  0
                )
              : 0)
          );
        }, 0);
        const totalFatSum = transformedData.reduce((sum, record) => {
          return (
            sum +
            (record.foods
              ? record.foods.reduce(
                  (foodSum, food) => foodSum + (food.fat || 0),
                  0
                )
              : 0)
          );
        }, 0);

        dispatch(
          setNutritionTotals({
            totalKcal: totalCalories,
            totalCarbs: totalCarbsSum,
            totalProtein: totalProteinSum,
            totalFat: totalFatSum,
          })
        );

        console.log("🔍 계산된 전체 영양소:", {
          totalKcal: totalCalories,
          totalCarbs: totalCarbsSum,
          totalProtein: totalProteinSum,
          totalFat: totalFatSum,
        });
      }
    } catch (err) {
      console.error("🚨 식사 기록 불러오기 실패:", err);
      dispatch(setError("식사 기록을 불러오는데 실패했습니다."));
    } finally {
      dispatch(setLoading(false));
    }
  }, [selectedDate, dispatch]);

  // selectedDate 변경시 식사 기록 로드
  useEffect(() => {
    loadMeals();
  }, [loadMeals]);

  const handleMealTypeClick = (mealType) => {
    setSelectedMealType(mealType);
    setIsMealPickerOpen(true);
  };

  // 식사 타입별 데이터 가져오기
  const getMealsByType = (type) => {
    return mealRecords.filter((meal) => meal.type === type);
  };

  return (
    <>
      <div className="p-4 sm:p-6 container mx-auto space-y-8 sm:w-[1020px]">
        <div className="flex gap-4 items-center justify-center">
          <div
            className="text-center text-lg sm:text-2xl font-bold cursor-pointer"
            onClick={() => changeDate(-1)}
          >
            〈
          </div>
          <div className="text-center text-lg sm:text-2xl font-bold">
            {new Date(selectedDate)
              .toLocaleDateString("ko-KR", {
                year: "2-digit",
                month: "2-digit",
                day: "2-digit",
                weekday: "short",
              })
              .replace(/\./g, "-")
              .replace(/\s/g, " ")}
          </div>
          <div
            className="text-center text-lg sm:text-2xl font-bold cursor-pointer"
            onClick={() => changeDate(1)}
          >
            〉
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg p-4 px-0 sm:px-40">
          <div className="text-md mb-4">
            <span className="font-bold">총 섭취량</span>{" "}
            <span className="text-purple-500 font-bold">{totalKcal}</span> /{" "}
            {calorieGoal}kcal
          </div>

          {/* 전체 kcal */}
          <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-purple-700 h-4 rounded-full"
              style={{
                width: `${Math.min((totalKcal / calorieGoal) * 100, 100)}%`,
              }}
            ></div>
          </div>
          <div className="flex gap-10 justify-between">
            <div>
              <div className="text-md mb-4 pr-10 sm:pr-24">
                <span className="font-bold text-sm sm:text-base">
                  탄수화물 <span className="text-green">{totalCarbs}</span>g
                </span>
              </div>

              {/* 전체 progress bar */}
              <div className="bg-gray-200 rounded-full h-4 mb-2">
                <div
                  className="bg-gradient-to-r from-green to-green-700 h-4 rounded-full"
                  style={{
                    width: `${Math.min((totalCarbs / 300) * 100, 100)}%`,
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="text-md mb-4 pr-10 sm:pr-24">
                <span className="font-bold text-sm sm:text-base">
                  단백질 <span className="text-yellow">{totalProtein}</span>g
                </span>
              </div>

              {/* 전체 progress bar */}
              <div className="bg-gray-200 rounded-full h-4 mb-2">
                <div
                  className="bg-gradient-to-r from-yellow to-yellow-700 h-4 rounded-full"
                  style={{
                    width: `${Math.min((totalProtein / 60) * 100, 100)}%`,
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="text-md mb-4 pr-10 sm:pr-24">
                <span className="font-bold text-sm sm:text-base">
                  지방 <span className="text-red">{totalFat}</span>g
                </span>
              </div>

              {/* 전체 progress bar */}
              <div className="bg-gray-200 rounded-full h-4 mb-2">
                <div
                  className="bg-gradient-to-r from-red to-red-700 h-4 rounded-full"
                  style={{ width: `${Math.min((totalFat / 70) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* 식사 기록 */}
        <h2 className="m-0 text-lg sm:text-xl font-semibold">식사기록</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {mealRecords.map((record) => (
            <div
              key={record.mealId || record.id}
              onClick={() => handleCardClick(record)}
            >
              <div className="card justify-between bg-base-100 w-full rounded-xl shadow-lg p-[20px]">
                <figure className="mt-4">
                  <img
                    className="rounded-xl h-[180px] w-full object-cover"
                    src={
                      record.imageUrl || record.image || "/images/food_1.jpg"
                    }
                    alt="음식 사진"
                  />
                </figure>
                <div className="card-body p-0">
                  <h2 className="card-title flex mt-2">
                    <span className="text-sm text-gray-500">
                      {record.type || record.mealType}
                    </span>
                    <span className="text-purple-500">
                      {record.totalKcal || record.kcal || record.calories}kcal
                    </span>
                  </h2>
                  <div className="text-[16px] font-semibold flex gap-4">
                    <p>
                      탄{" "}
                      <span className="text-green">
                        {record.totalCarbs ||
                          record.carbs ||
                          (record.foods
                            ? record.foods.reduce(
                                (sum, food) => sum + (food.carbs || 0),
                                0
                              )
                            : 0)}
                      </span>
                      g
                    </p>
                    <p>
                      단{" "}
                      <span className="text-yellow">
                        {record.totalProtein ||
                          record.protein ||
                          (record.foods
                            ? record.foods.reduce(
                                (sum, food) => sum + (food.protein || 0),
                                0
                              )
                            : 0)}
                      </span>
                      g
                    </p>
                    <p>
                      지{" "}
                      <span className="text-red">
                        {record.totalFat ||
                          record.fat ||
                          (record.foods
                            ? record.foods.reduce(
                                (sum, food) => sum + (food.fat || 0),
                                0
                              )
                            : 0)}
                      </span>
                      g
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <MealPickerModal />
    </>
  );
}

export default Meal;
