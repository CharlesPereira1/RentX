import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { useAuth } from '../hooks/auth';

import AppTabRoutes from './app.tab.routes';
import AuthRoutes from './auth.routes';
import LoadAnimation from '../components/LoadAnimation';

const routes: React.FC = () => {
  const { user, loading } = useAuth();

  return (
    <NavigationContainer>
      {user.id ? <AppTabRoutes /> : <AuthRoutes />}
    </NavigationContainer>
  );
};

export default routes;
