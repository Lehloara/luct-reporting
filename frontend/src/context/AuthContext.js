import React, { createContext, useState, useEffect, useContext } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";

const AuthContext = createContext({});
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // ✅ default prevents blank UI issues
  const [role, setRole] = useState("student");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("AUTH CHANGE:", firebaseUser?.email);

      if (firebaseUser) {
        setUser(firebaseUser);

        const snap = await getDoc(doc(db, "users", firebaseUser.uid));

        setRole(snap.exists() ? snap.data().role : "student");
      } else {
        setUser(null);
        setRole("student");
      }

      setLoading(false);
    });

    return unsub;
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setRole("student");
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};