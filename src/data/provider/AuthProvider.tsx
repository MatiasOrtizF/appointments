import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";

import { auth, db } from "../../config/Firebase";

type Role = "admin" | "user";

type AuthContextType = {
  loading: boolean;
  isAuthenticated: boolean;
  role: Role;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType>({
  loading: true,
  isAuthenticated: false,
  role: "user",
  isAdmin: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<Role>("user");

  useEffect(() => {
    let unsubscribeUserDoc: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (unsubscribeUserDoc) {
        unsubscribeUserDoc();
        unsubscribeUserDoc = null;
      }

      if (!firebaseUser) {
        setIsAuthenticated(false);
        setRole("user");
        setLoading(false);
        return;
      }

      setIsAuthenticated(true);
      setLoading(true);

      unsubscribeUserDoc = onSnapshot(
        doc(db, "user", firebaseUser.uid),
        (snapshot) => {
          const data = snapshot.data();

          setRole(data?.role === "admin" ? "admin" : "user");
          setLoading(false);
        },
        () => {
          setRole("user");
          setLoading(false);
        }
      );
    });

    return () => {
      unsubscribeAuth();

      if (unsubscribeUserDoc) {
        unsubscribeUserDoc();
      }
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        loading,
        isAuthenticated,
        role,
        isAdmin: role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}