import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import getUserById from "../api/users/getUserById";
import { ActivityIndicator, View } from "react-native";

const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setIsLoading(true);
      const user = currentUser ? await getUserById(currentUser.uid) : null;
      setUser(user as User);
      setIsAuthenticated(Boolean(user));
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const value = {
    isLoading,
    isAuthenticated,
    user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

function useAuth() {
  return useContext(AuthContext);
}

interface Context {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null;
}

const initialContext = {
  isLoading: false,
  isAuthenticated: false,
  user: null,
};

const AuthContext = createContext<Context>(initialContext);

export { useAuth };

export default AuthProvider;
