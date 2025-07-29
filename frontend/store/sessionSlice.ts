import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Session {
  id: string;
  title: string;
  createdAt: string;
}

interface SessionsState {
  sessions: Session[];
  loading: boolean;
  error: string | null;
}

const initialState: SessionsState = {
  sessions: [],
  loading: false,
  error: null,
};

const sessionsSlice = createSlice({
  name: "sessions",
  initialState,
  reducers: {
    fetchSessionsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchSessionsSuccess(state, action: PayloadAction<Session[]>) {
      state.sessions = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchSessionsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    addSession(state, action: PayloadAction<Session>) {
      state.sessions.push(action.payload);
    },
    removeSession(state, action: PayloadAction<string>) {
      state.sessions = state.sessions.filter(
        (session) => session.id !== action.payload
      );
    },
    updateSession(state, action: PayloadAction<Session>) {
      const index = state.sessions.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) {
        state.sessions[index] = action.payload;
      }
    },
  },
});

export const {
  fetchSessionsStart,
  fetchSessionsSuccess,
  fetchSessionsFailure,
  addSession,
  removeSession,
  updateSession,
} = sessionsSlice.actions;

export default sessionsSlice.reducer;
