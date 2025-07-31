import React, { useState } from "react";
import { getThumbnailUrl } from "../../../utils/imageUpload/uploadImageToSupabase";

export default function MealCard({ meal }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Try to get thumbnail URL for better performance
  const thumbnailUrl = meal.imageUrl ? getThumbnailUrl(meal.imageUrl) : null;
  const displayUrl = thumbnailUrl || meal.imageUrl;

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <div className="flex items-start space-x-4">
        {/* Meal Image with Thumbnail */}
        <div className="flex-shrink-0">
          {displayUrl && !imageError ? (
            <img
              src={displayUrl}
              alt={`${meal.type} 식사`}
              className="w-20 h-20 rounded-lg object-cover transition-opacity duration-300"
              onLoad={handleImageLoad}
              onError={handleImageError}
              loading="lazy"
            />
          ) : (
            <div className="w-20 h-20 rounded-lg bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-sm">이미지 없음</span>
            </div>
          )}
        </div>

        {/* Meal Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{meal.type}</h3>
            <span className="text-sm text-gray-500">
              {new Date(meal.createDate).toLocaleTimeString("ko-KR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          {/* Nutrition Info */}
          <div className="grid grid-cols-3 gap-4 mb-3">
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">
                {meal.totalKcal}
              </div>
              <div className="text-xs text-gray-500">kcal</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold text-gray-700">
                {meal.foods?.length || 0}
              </div>
              <div className="text-xs text-gray-500">음식</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold text-gray-700">
                {meal.fastingTime || "-"}
              </div>
              <div className="text-xs text-gray-500">공복시간</div>
            </div>
          </div>

          {/* Food List */}
          {meal.foods && meal.foods.length > 0 && (
            <div className="space-y-1">
              <div className="text-sm font-medium text-gray-700">
                음식 목록:
              </div>
              <div className="flex flex-wrap gap-1">
                {meal.foods.map((food, index) => (
                  <span
                    key={food.foodId || index}
                    className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                  >
                    {food.foodName}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Memo */}
          {meal.memo && (
            <div className="mt-2 text-sm text-gray-600">
              <span className="font-medium">메모:</span> {meal.memo}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
