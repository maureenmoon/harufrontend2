import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedMeal } from "../../slices/mealSlice";

function MealPickerModal() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedMeal = useSelector((state) => state.meal.selectedMeal);

  const meals = ["아침", "점심", "저녁", "간식"];

  const handleConfirm = () => {
    if (!selectedMeal) return alert("식사 타입을 선택하세요.");
    console.log("선택한 식사 타입:", selectedMeal);
    setOpen(false);
    navigate("/Analyis");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        className="btn text-white rounded-full bg-purple-500 text-2xl border-none w-13 h-13 flex items-center justify-center"
        onClick={() => setOpen(true)}
      >
        +
      </button>

      {open && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <div className="flex flex-col gap-2">
              {meals.map((meal) => (
                <button
                  key={meal}
                  className={`btn btn-ghost border-none ${
                    selectedMeal === meal ? "text-purple-500 font-bold" : ""
                  }`}
                  onClick={() => dispatch(setSelectedMeal(meal))}
                >
                  {meal}
                </button>
              ))}
            </div>

            <div className="modal-action">
              <button className="btn" onClick={() => setOpen(false)}>
                취소
              </button>
              <button
                className="btn bg-purple-500 text-white"
                onClick={handleConfirm}
              >
                확인
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}

export default MealPickerModal;
