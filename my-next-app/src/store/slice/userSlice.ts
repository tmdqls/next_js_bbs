import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Api from "@/app/api/API";
import { UserJwtPayload } from "../../models/UserJwtPayload";

interface userState extends UserJwtPayload {
  isLoggedIn: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: userState = {
  isLoggedIn: false,
  id: 0,
  email: "",
  name: "",
  status: "idle",
  error: null,
};

// Signin
export const signin = createAsyncThunk(
  "user/signin",
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const { data } = await Api.signIn(email, password);
      return data;
    } catch (error) {
      return rejectWithValue(
        axios.isAxiosError(error) ? error.response?.data : "予期しないエラーが発生しました。もう一度お試しください。"
      );
    }
  }
);

// Signup
export const signup = createAsyncThunk(
  "user/signin",
  async ({ email, password, name }: { email: string; password: string; name: string }, { rejectWithValue }) => {
    try {
      const { data } = await Api.signUp(email, password, name);
      return data;
    } catch (error) {
      return rejectWithValue(
        axios.isAxiosError(error) ? error.response?.data : "予期しないエラーが発生しました。もう一度お試しください。"
      );
    }
  }
);

// Signout
export const signout = createAsyncThunk(
  "user/signout",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await Api.signOut();
      return data;
    } catch (error) {
      return rejectWithValue(
        axios.isAxiosError(error) ? error.response?.data : "予期しないエラーが発生しました。もう一度お試しください。"
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    // signin
    builder
      .addCase(signin.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signin.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isLoggedIn = true;
        state.id = action.payload.id;
        state.email = action.payload.email;
        state.name = action.payload.name;
      })
      .addCase(signin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
        console.log(action.payload);
      });
    // signout
    builder
      .addCase(signout.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signout.fulfilled, (state) => {
        state.status = "succeeded";
        state.isLoggedIn = false;
        state.id = 0;
        state.email = "";
        state.name = "";
      })
      .addCase(signout.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
        console.log(action.payload);
      });
  },
});

export default userSlice.reducer;