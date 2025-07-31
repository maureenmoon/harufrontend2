import React from "react";

export default function ProfileImage({ photo, nickname, onClick }) {
  const getInitial = (name) => name?.charAt(0).toUpperCase();

  return (
    <div className="relative text-center">
      {photo ? (
        <img
          src={photo}
          alt="profile"
          className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full object-cover"
        />
      ) : (
        <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full bg-green-300 flex items-center justify-center text-white font-bold text-3xl">
          {getInitial(nickname)}
        </div>
      )}
      {onClick && (
        <button
          onClick={onClick}
          className="mt-2 text-sm text-blue-500 hover:underline"
        >
          사진 변경
        </button>
      )}
    </div>
  );
}
