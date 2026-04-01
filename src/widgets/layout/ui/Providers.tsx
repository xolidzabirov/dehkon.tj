'use client';

import React, { useEffect } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/shared/store';
import { useAppDispatch, useAppSelector } from '@/shared/store/hooks';
import { fetchCurrentUser } from '@/features/auth/model/authSlice';
import { ThemeProvider } from '@/features/theme';
import { I18nProvider } from '@/features/i18n';

function AuthHydrator({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { token, isAuthenticated, user } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (token && !isAuthenticated && !user) {
      dispatch(fetchCurrentUser());
    }
  }, [token, isAuthenticated, user, dispatch]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <I18nProvider>
        <ThemeProvider>
          <AuthHydrator>
            {children}
          </AuthHydrator>
        </ThemeProvider>
      </I18nProvider>
    </ReduxProvider>
  );
}
