import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut, getRedirectResult } from "firebase/auth";
import { auth } from "../firebase";
import { AuthContext } from "../hooks/useAuth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          const authorizedEmail = import.meta.env.VITE_AUTHORIZED_EMAIL;
          if (result.user.email !== authorizedEmail) {
            await signOut(auth);
            alert("Access is restricted. This atlas is private.");
          }
        }
      } catch (err) {
        console.error("Redirect result error:", err);
      }

      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        setUser(firebaseUser);
        setLoading(false);
      });
      return () => unsubscribe();
    }
    init();
  }, []);

  async function signOutUser() {
    await signOut(auth);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
}
