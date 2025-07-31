import { createSlice } from "@reduxjs/toolkit";

//fix redux clean-up: re-login
const storeUser = JSON.parse(localStorage.getItem("user"));

const emptyUser = {
  email: "",
  nickname: "",
  // userid: null,
  memberId: null,
  name: "",
  height: null,
  weight: null,
  targetCalories: null,
  activityLevel: "",
  role: "",
  photo: "",
};

const initState = {
  // isLoggedIn: false,
  // user: { ...emptyUser },
  isLoggedIn: !!storeUser,
  user: storeUser || { ...emptyUser },
};

const loginSlice = createSlice({
  name: "loginSlice",
  initialState: initState,
  reducers: {
    login: (state, action) => {
      const updatedUser = { ...state.user, ...action.payload };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return {
        isLoggedIn: true,
        // user: { ...action.payload }, // decoded token or /me data

        user: {
          ...state.user,
          ...action.payload,

          // user: updatedUser,
        },
      };
    },
    logout: () => {
      localStorage.removeItem("user");
      return {
        isLoggedIn: false,
        user: { ...emptyUser },
      };
    },
    editProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    updatePhoto: (state, action) => {
      state.user.photo = action.payload;
    },
    setNickname: (state, action) => {
      state.user.nickname = action.payload;
    },
  },
});

export const { login, logout, editProfile, updatePhoto, setNickname } =
  loginSlice.actions;

export default loginSlice.reducer;
