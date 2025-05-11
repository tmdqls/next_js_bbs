import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Api from "../../api/API";
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
  role: "",
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
        state.role = action.payload.role;
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
      })
      .addCase(signout.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
        console.log(action.payload);
      });
  },
});

export default userSlice.reducer;