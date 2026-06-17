import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile } from '@/types/user';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isGuest: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isGuest: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<UserProfile>) => {
      const { password, password_hash, ...safeUser } = action.payload as UserProfile & {
        password?: string;
        password_hash?: string;
      };
      void password;
      void password_hash;
      state.user = safeUser;
      state.isAuthenticated = true;
      state.isGuest = safeUser.is_guest ?? false;
    },
    updateUser: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        if (action.payload.is_guest !== undefined) {
          state.isGuest = action.payload.is_guest;
        }
      }
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isGuest = true;
    },
  },
});

export const { setCredentials, updateUser, logout } = authSlice.actions;
export default authSlice.reducer;