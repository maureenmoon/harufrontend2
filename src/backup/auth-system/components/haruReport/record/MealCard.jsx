import React from "react";

function MealCard({ meal }) {
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div className="bg-gray-50 rounded-2xl p-3 sm:p-4 shadow-sm">
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <div className="w-full sm:w-30 h-30 bg-gray-200 rounded-lg overflow-hidden">
            {meal.imageUrl && (
              <img
                src={meal.imageUrl}
                alt="식사 이미지"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <div className="flex-1 w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                {meal.type}
                <span className="text-xs sm:text-sm font-normal ml-1 text-gray-600">
                  {formatTime(meal.createDate)}
                </span>
              </h3>

              <div className="text-right mt-1 sm:mt-0">
                <p className="text-base sm:text-lg font-semibold">
                  {meal.totalKcal}kcal
                </p>
              </div>
            </div>

            {meal.foods.length > 0 && (
              <div className="mb-2">
                <h4 className="font-semibold mb-1 text-gray-800 text-sm sm:text-base">
                  섭취 음식
                </h4>
                <div className="flex flex-wrap gap-2">
                  {meal.foods.map((food) => (
                    <span
                      key={food.foodId}
                      className="bg-white px-2 py-1 rounded text-xs sm:text-sm"
                    >
                      {food.foodName} ({food.kcal}kcal)
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MealCard;
