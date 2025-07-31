import React from "react";

function HaruCalendar({ selectedDate, mealData, onDateClick, onMonthChange }) {
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const getWeekdayColor = (dayIndex) => {
    if (dayIndex === 0) return "text-red-500"; // 일요일
    if (dayIndex === 6) return "text-blue-500"; // 토요일
    return "text-gray-900"; // 평일
  };

  const getMealDataForDate = (date) => {
    if (!date || !mealData) return [];

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return mealData.filter((meal) => {
      const mealDate = new Date(meal.createDate);
      return mealDate >= startOfDay && mealDate <= endOfDay;
    });
  };

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

  const handlePrevMonth = () => {
    const newDate = new Date(year, month - 1, 1);
    onMonthChange(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(year, month + 1, 1);
    onMonthChange(newDate);
  };

  const renderDays = () => {
    const days = [];
    const today = new Date();

    // 이전 달의 마지막 날짜들을 비활성화 상태로 표시
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-[120px] p-2 bg-gray-50" />
      );
    }

    // 현재 달의 날짜들
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayMeals = getMealDataForDate(date);
      const isToday =
        today.getDate() === day &&
        today.getMonth() === month &&
        today.getFullYear() === year;
      const dayIndex = (firstDayOfMonth + day - 1) % 7;

      days.push(
        <div
          key={day}
          onClick={() => onDateClick(date)}
          className={`h-[120px] p-2 border border-gray-100 cursor-pointer
            ${isToday ? "bg-purple-50" : "hover:bg-gray-50"}`}
        >
          <div className={`text-base ${getWeekdayColor(dayIndex)}`}>{day}</div>
          {dayMeals && dayMeals.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {dayMeals.map((meal) => (
                <div
                  key={meal.mealId}
                  className={`w-2 h-2 rounded-full ${
                    meal.type === "아침"
                      ? "bg-yellow-300"
                      : meal.type === "점심"
                      ? "bg-blue-300"
                      : meal.type === "저녁"
                      ? "bg-red-300"
                      : "bg-purple-300"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="w-full bg-white rounded-lg p-4 mb-8">
      {/* 달력 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          ◀
        </button>
        <div className="text-2xl font-semibold text-gray-700">
          {`${year}.${String(month + 1).padStart(2, "0")}`}
        </div>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          ▶
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 mb-2">
        {weekdays.map((day, index) => (
          <div
            key={day}
            className={`text-sm font-semibold text-center ${getWeekdayColor(
              index
            )}`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-px">{renderDays()}</div>
    </div>
  );
}

export default HaruCalendar;
