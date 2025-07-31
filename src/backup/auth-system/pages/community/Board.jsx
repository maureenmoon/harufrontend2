import React from "react";
import MainBoard from "../../components/community/board/MainBoard";
import { Route, Routes } from "react-router-dom";
import Write from "../../components/community/board/Write";
import WriteView from "../../components/community/board/WriteView";

function Board() {
  return (
    <div className="w-[1020px] mx-auto">
      <Routes>
        <Route index element={<MainBoard />} />
        <Route path="write" element={<Write />} />
        <Route path="writeview/:id" element={<WriteView />} />
      </Routes>
    </div>
  );
}

export default Board;
