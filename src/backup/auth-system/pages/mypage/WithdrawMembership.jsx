// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { logout } from "../../slices/loginSlice";
// import { deleteAccount } from "../../api/authIssueUserApi/memberApi";
// import SubLayout from "../../layout/SubLayout";

// export default function WithdrawMembership() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [isLoading, setIsLoading] = useState(false);
//   const [confirmation, setConfirmation] = useState("");

//   const handleWithdraw = async () => {
//     if (confirmation !== "회원탈퇴") {
//       alert("확인 문구를 정확히 입력해주세요.");
//       return;
//     }

//     if (
//       !window.confirm("정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.")
//     ) {
//       return;
//     }

//     try {
//       setIsLoading(true);
//       await deleteAccount();
//       dispatch(logout());
//       alert("회원탈퇴가 완료되었습니다.");
//       navigate("/");
//     } catch (error) {
//       const message =
//         error.response?.data?.message || "회원탈퇴에 실패했습니다.";
//       alert(message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="w-full max-w-[1020px] mx-auto px-4">
//       <SubLayout to="/mypage" menu="마이페이지" label="회원탈퇴" />

//       <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
//         <div className="space-y-6">
//           <div>
//             <h2 className="text-2xl font-bold text-red-600">회원탈퇴</h2>
//             <p className="mt-2 text-gray-600">
//               회원탈퇴를 진행하시면 모든 데이터가 영구적으로 삭제되며, 이 작업은
//               되돌릴 수 없습니다.
//             </p>
//           </div>

//           <div className="space-y-4">
//             <div>
//               <h3 className="font-semibold text-gray-700">탈퇴 시 유의사항:</h3>
//               <ul className="mt-2 space-y-2 text-sm text-gray-600 list-disc list-inside">
//                 <li>모든 개인정보가 삭제됩니다.</li>
//                 <li>작성한 게시글과 댓글은 삭제되지 않습니다.</li>
//                 <li>삭제된 데이터는 복구할 수 없습니다.</li>
//               </ul>
//             </div>

//             <div className="pt-4">
//               <label className="block text-sm font-medium text-gray-700">
//                 탈퇴를 진행하시려면 '회원탈퇴'를 입력해주세요
//               </label>
//               <input
//                 type="text"
//                 value={confirmation}
//                 onChange={(e) => setConfirmation(e.target.value)}
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
//                 placeholder="회원탈퇴"
//                 disabled={isLoading}
//               />
//             </div>
//           </div>

//           <div className="flex justify-end space-x-4 pt-4">
//             <button
//               onClick={() => navigate("/mypage")}
//               className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
//               disabled={isLoading}
//             >
//               취소
//             </button>
//             <button
//               onClick={handleWithdraw}
//               className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
//               disabled={isLoading || confirmation !== "회원탈퇴"}
//             >
//               {isLoading ? "처리 중..." : "회원탈퇴"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
