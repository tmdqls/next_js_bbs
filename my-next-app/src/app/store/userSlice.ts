import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface userState {
  isLoggedIn: boolean;
  id: number;
  email: string;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: userState = {
  isLoggedIn: false,
  id: 0,
  email: "",
  status: "idle",
  error: null,
};

// Signin
export const signin = createAsyncThunk(
  "user/signin",
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/api/user/signin", { email, password });
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
  async ({}, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/api/user/signout");
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
      })
      .addCase(signin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
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
      })
      .addCase(signout.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default userSlice.reducer;