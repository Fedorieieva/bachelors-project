import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

import storage from './storage';
import rootReducer from './rootReducer';

type RootReducerState = ReturnType<typeof rootReducer>;

const sanitizingReducer = (
  state: RootReducerState | undefined,
  action: { type: string },
): RootReducerState => {
  if (action.type === 'auth/logout') {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('persist:root');
      localStorage.setItem('is_guest', 'true');
    }
    return rootReducer(undefined, action as Parameters<typeof rootReducer>[1]);
  }
  return rootReducer(state, action as Parameters<typeof rootReducer>[1]);
};

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
};

const persistedReducer = persistReducer(persistConfig, sanitizingReducer);

export const store = configureStore({
  devTools: true,
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;