import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {SessionUser} from '@/features/auth/types';

interface SessionState {
  user: SessionUser | null;
}

const initialState: SessionState = {user: null};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    signedIn(state, action: PayloadAction<SessionUser>) {
      state.user = action.payload;
    },
    signedOut(state) {
      state.user = null;
    },
  },
});

export const {signedIn, signedOut} = sessionSlice.actions;
export default sessionSlice.reducer;