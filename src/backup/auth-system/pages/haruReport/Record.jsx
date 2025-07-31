import React, { useState, useEffect } from "react";

import HaruCalendar from "../../components/haruReport/record/Calendar";
import MealCard from "../../components/haruReport/record/MealCard";
import { Link } from "react-router-dom";
import MealSummary from "../../components/haruReport/record/MealSummary";
import SubLayout from "../../layout/SubLayout";

function Record() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState([]);
  const [mealData, setMealData] = useState([]);
  const [mealCounts, setMealCounts] = useState({
    breakfast: 0,
    lunch: 0,
    dinner: 0,
    snack: 0,
  });

  // TODO: API 연동 후 실제 데이터로 교체
  useEffect(() => {
    // 임시 데이터
    const dummyData = [
      {
        mealId: 1,
        type: "아침",
        createDate: "2025-07-16T09:00:00",
        updateDate: "2025-07-16T09:00:00",
        imageUrl: "/images/food_3.jpg",
        memo: "식사 소요 시간 10분",
        totalKcal: "397",
        fastingTime: "",
        foods: [
          {
            foodId: 1,
            foodName: "김밥",
            kcal: 100,
            carbs: 234,
            protein: 234,
            fat: 234,
            sodium: 2234,
            fiber: 34,
            gram: 34,
          },
          {
            foodId: 2,
            foodName: "미역국",
            kcal: 297,
            carbs: 234,
            protein: 234,
            fat: 234,
            sodium: 2234,
            fiber: 34,
            gram: 34,
          },
        ],
      },
      {
        mealId: 2,
        type: "점심",
        createDate: "2025-07-16T12:30:00",
        updateDate: "2025-07-16T12:30:00",
        imageUrl: "/images/food_2.jpg",
        memo: "동료들과 점심 식사",
        totalKcal: "856",
        fastingTime: "3시간 30분",
        foods: [
          {
            foodId: 3,
            foodName: "제육볶음",
            kcal: 450,
            carbs: 234,
            protein: 234,
            fat: 234,
            sodium: 2234,
            fiber: 34,
            gram: 34,
          },
          {
            foodId: 4,
            foodName: "현미밥",
            kcal: 307,
            carbs: 234,
            protein: 234,
            fat: 234,
            sodium: 2234,
            fiber: 34,
            gram: 34,
          },
        ],
      },
      {
        mealId: 3,
        type: "저녁",
        createDate: "2025-07-16T18:30:00",
        updateDate: "2025-07-16T18:30:00",
        imageUrl: "/images/food_1.jpg",
        memo: "가벼운 저녁 식사",
        totalKcal: "450",
        fastingTime: "6시간",
        foods: [
          {
            foodId: 5,
            foodName: "샐러드",
            kcal: 150,
            carbs: 234,
            protein: 234,
            fat: 234,
            sodium: 2234,
            fiber: 34,
            gram: 34,
          },
          {
            foodId: 6,
            foodName: "닭가슴살",
            kcal: 300,
            carbs: 234,
            protein: 234,
            fat: 234,
            sodium: 2234,
            fiber: 34,
            gram: 34,
          },
        ],
      },
      {
        mealId: 4,
        type: "아침",
        createDate: "2025-07-17T08:30:00",
        updateDate: "2025-07-17T08:30:00",
        imageUrl: "/images/food_6.jpg",
        memo: "건강한 아침 식사",
        totalKcal: "420",
        fastingTime: "14시간",
        foods: [
          {
            foodId: 7,
            foodName: "오트밀",
            kcal: 220,
            carbs: 234,
            protein: 234,
            fat: 234,
            sodium: 2234,
            fiber: 34,
            gram: 34,
          },
          {
            foodId: 8,
            foodName: "바나나",
            kcal: 100,
            carbs: 234,
            protein: 234,
            fat: 234,
            sodium: 2234,
            fiber: 34,
            gram: 34,
          },
          {
            foodId: 9,
            foodName: "우유",
            kcal: 100,
            carbs: 234,
            protein: 234,
            fat: 234,
            sodium: 2234,
            fiber: 34,
            gram: 34,
          },
        ],
      },
      {
        mealId: 5,
        type: "간식",
        createDate: "2025-07-17T15:30:00",
        updateDate: "2025-07-17T15:30:00",
        imageUrl: "/images/food_5.jpg",
        memo: "오후 간식",
        totalKcal: "200",
        fastingTime: "3시간",
        foods: [
          {
            foodId: 10,
            foodName: "그릭요거트",
            kcal: 150,
            carbs: 234,
            protein: 234,
            fat: 234,
            sodium: 2234,
            fiber: 34,
            gram: 34,
          },
          {
            foodId: 11,
            foodName: "블루베리",
            kcal: 50,
            carbs: 234,
            protein: 234,
            fat: 234,
            sodium: 2234,
            fiber: 34,
            gram: 34,
          },
        ],
      },
      {
        mealId: 6,
        type: "점심",
        createDate: "2025-07-18T12:00:00",
        updateDate: "2025-07-18T12:00:00",
        imageUrl: "/images/food_7.jpg",
        memo: "비오는 날 국물 요리",
        totalKcal: "780",
        fastingTime: "4시간",
        foods: [
          {
            foodId: 12,
            foodName: "김치찌개",
            kcal: 450,
            carbs: 234,
            protein: 234,
            fat: 234,
            sodium: 2234,
            fiber: 34,
            gram: 34,
          },
          {
            foodId: 13,
            foodName: "공기밥",
            kcal: 330,
            carbs: 234,
            protein: 234,
            fat: 234,
            sodium: 2234,
            fiber: 34,
            gram: 34,
          },
        ],
      },
      {
        mealId: 7,
        type: "저녁",
        createDate: "2025-07-17T19:00:00",
        updateDate: "2025-07-17T19:00:00",
        imageUrl: "/images/food_4.jpg",
        memo: "저녁 식사",
        totalKcal: "650",
        fastingTime: "4시간",
        foods: [
          {
            foodId: 14,
            foodName: "연어구이",
            kcal: 350,
            carbs: 0,
            protein: 42,
            fat: 22,
            sodium: 520,
            fiber: 0,
            gram: 150,
          },
          {
            foodId: 15,
            foodName: "현미밥",
            kcal: 300,
            carbs: 65,
            protein: 5,
            fat: 2,
            sodium: 10,
            fiber: 2,
            gram: 210,
          },
        ],
      },
    ];

    setMealData(dummyData);
  }, []);

  // 선택된 날짜의 식사 데이터를 가져오는 함수
  const getSelectedMeals = () => {
    if (!selectedDates.length || !mealData) return [];

    return selectedDates
      .flatMap((date) => {
        // 선택된 날짜의 시작과 끝 시간을 한국 시간대 기준으로 설정
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        return mealData.filter((meal) => {
          const mealDate = new Date(meal.createDate);
          return mealDate >= startOfDay && mealDate <= endOfDay;
        });
      })
      .sort((a, b) => new Date(b.createDate) - new Date(a.createDate));
  };

  // 날짜 클릭 핸들러
  const handleDateClick = (date) => {
    setSelectedDate(date);
    setSelectedDates((prev) => {
      const dateStr = date.toISOString().split("T")[0];
      const exists = prev.some(
        (d) => d.toISOString().split("T")[0] === dateStr
      );

      if (exists) {
        return prev.filter((d) => d.toISOString().split("T")[0] !== dateStr);
      } else {
        return [...prev, date];
      }
    });
  };

  // 식사 통계 계산
  useEffect(() => {
    const counts = {
      breakfast: 0,
      lunch: 0,
      dinner: 0,
      snack: 0,
    };

    mealData.forEach((meal) => {
      counts[meal.type.toLowerCase()]++;
    });

    setMealCounts(counts);
  }, [mealData]);

  // 선택된 월의 식사 타입별 카운트 계산
  useEffect(() => {
    const counts = {
      아침: 0,
      점심: 0,
      저녁: 0,
      간식: 0,
    };

    mealData.forEach((meal) => {
      const mealDate = new Date(meal.createDate);
      if (
        mealDate.getMonth() === selectedDate.getMonth() &&
        mealDate.getFullYear() === selectedDate.getFullYear()
      ) {
        counts[meal.type]++;
      }
    });

    setMealCounts(counts);
  }, [mealData, selectedDate]);

  return (
    <div className="w-full max-w-[1020px] mx-auto px-4 sm:px-6">
      <SubLayout to="/haruReport" menu="리포트" label="기록습관" />
      <div className="mt-6 sm:mt-10 space-y-6">
        <MealSummary mealCounts={mealCounts} />
        <HaruCalendar
          selectedDate={selectedDate}
          mealData={mealData}
          onDateClick={handleDateClick}
          onMonthChange={(date) => {
            setSelectedDate(date);
            setSelectedDates([]);
          }}
          className="mb-8"
        />

        {selectedDates.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg sm:text-2xl font-bold mb-4 text-gray-700 ml-2">
              |선택된 날짜의 식사 기록
            </h2>

            {/* 날짜별로 그룹핑 */}
            {(() => {
              const grouped = getSelectedMeals().reduce((acc, meal) => {
                const dateKey = new Date(meal.createDate).toLocaleDateString(
                  "ko-KR",
                  {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  }
                );
                if (!acc[dateKey]) acc[dateKey] = [];
                acc[dateKey].push(meal);
                return acc;
              }, {});

              const sortedDates = Object.keys(grouped).sort(
                (a, b) => new Date(b) - new Date(a)
              );

              return sortedDates.map((date, idx) => {
                const meals = grouped[date].sort(
                  (a, b) => new Date(b.createDate) - new Date(a.createDate)
                );

                // 이전 날짜 마지막 식사 ↔ 현재 날짜 첫 식사
                const prevDate = sortedDates[idx - 1];
                const prevLastMeal = prevDate
                  ? grouped[prevDate][grouped[prevDate].length - 1]
                  : null;
                const currentFirstMeal = meals[0];

                // 공복 시간 계산
                let fastingGap = null;
                if (prevLastMeal && currentFirstMeal) {
                  const gapHours =
                    Math.abs(
                      new Date(prevLastMeal.createDate) -
                        new Date(currentFirstMeal.createDate)
                    ) /
                    (1000 * 60 * 60); // 시간 단위

                  fastingGap =
                    gapHours % 1 === 0
                      ? gapHours.toFixed(0)
                      : gapHours.toFixed(1);
                }

                return (
                  <React.Fragment key={date}>
                    {/* 날짜 간 공복 구간 표시 */}
                    {idx > 0 && fastingGap && (
                      <div className="flex items-center ml-5 ">
                        <img
                          src="/images/mark.png"
                          alt="날짜 사이 공복 타임라인"
                          className="h-12 mr-2"
                        />
                        <span className="text-sm text-purple-600 font-semibold">
                          공복시간: {fastingGap}시간
                        </span>
                      </div>
                    )}

                    {/* 날짜별 카드 묶음 */}
                    <div className="border border-gray-300 rounded-2xl p-4 sm:p-6 bg-white shadow">
                      <h3 className="text-mb font-semibold text-gray-700 mb-1 mr-3 flex justify-end">
                        {date}
                      </h3>

                      {meals.map((meal, index) => (
                        <div key={meal.mealId} className="relative">
                          <MealCard meal={meal} />

                          {/* 같은 날짜 내 식사 사이 공복 */}
                          {index < meals.length - 1 && (
                            <div className="flex items-center ml-5 ">
                              <img
                                src="/images/mark.png"
                                alt="공복 타임라인"
                                className="h-12 mr-2"
                              />
                              {meal.fastingTime && (
                                <span className="text-sm text-gray-500 font-semibold">
                                  공복시간: {meal.fastingTime}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </React.Fragment>
                );
              });
            })()}
          </div>
        )}
      </div>
    </div>
  );
}

export default Record;
