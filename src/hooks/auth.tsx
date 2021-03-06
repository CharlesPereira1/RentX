import React, { createContext, useState, useContext, useEffect } from 'react';

import api from '../services/api';
import { database } from '../databases';

import { User as ModelUser } from '../databases/model/User';

interface User {
  id: string;
  user_id: string;
  email: string;
  name: string;
  driver_license: string;
  avatar: string;
  token: string;
}
interface SigninCredentials {
  email: string;
  password: string;
}

interface AuthcontextData {
  user: User;
  loading: boolean;
  signIn: (credential: SigninCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (user: User) => Promise<void>;
}

const AuthContext = createContext<AuthcontextData>({} as AuthcontextData);

const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<User>({} as User);
  const [loading, setLoading] = useState(true);

  const signIn = async ({ email, password }: SigninCredentials) => {
    try {
      const response = await api.post('/sessions', {
        email,
        password,
      });

      const { token, user } = response.data;
      api.defaults.headers.authorization = `Bearer ${token}`;

      //salvar database local
      const userCollection = database.get<ModelUser>('users');
      await database.action(async () => {
        await userCollection.create((newUser) => {
          (newUser.user_id = user.id),
            (newUser.name = user.name),
            (newUser.email = user.email),
            (newUser.driver_license = user.driver_license),
            (newUser.avatar = user.avatar),
            (newUser.token = token);
        });
      });

      setData({ ...user, token });
    } catch (error) {
      throw new Error(error);
    }
  };

  const signOut = async () => {
    try {
      const userCollection = database.get<ModelUser>('users');

      await database.action(async () => {
        const userSelected = await userCollection.find(data.id);

        await userSelected.destroyPermanently();
      });

      setData({} as User);
    } catch (error) {
      throw new Error(error);
    }
  };

  const updateUser = async (user: User) => {
    try {
      const userCollection = database.get<ModelUser>('users');
      await database.action(async () => {
        const userSelect = await userCollection.find(user.id);
        await userSelect.update((userData) => {
          (userData.name = user.name),
            (userData.driver_license = user.driver_license),
            (userData.avatar = user.avatar);
        });
      });

      setData(user);
    } catch (error) {
      throw new Error(error);
    }
  };

  useEffect(() => {
    const loadUserData = async () => {
      const userCollection = database.get<ModelUser>('users');
      const response = await userCollection.query().fetch();

      // captura user do watermelon
      if (response.length > 0) {
        const userData = response[0]._raw as unknown as User;

        //incluir novamente o cabe??alho do token
        api.defaults.headers.authorization = `Bearer ${userData.token}`;
        setData(userData);
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user: data, loading, signIn, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = (): AuthcontextData => {
  const context = useContext(AuthContext);

  return context;
};

export { AuthProvider, useAuth };
