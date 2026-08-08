import { createContext, useContext, useEffect, useState } from "react";
import { auth, onAuthStateChanged } from "../../lib/firebase";
const AuthContext = createContext({
  user: null,
  loading: true,
  isAuthenticated: false
});
const useAuth = () => useContext(AuthContext);
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);
  return <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>;
};
export {
  AuthProvider,
  useAuth
};
