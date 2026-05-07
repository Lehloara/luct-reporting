import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";

import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";

const safeAuth = () => {
  if (!auth) throw new Error("Auth not ready");
  return auth;
};

const safeDb = () => {
  if (!db) throw new Error("DB not ready");
  return db;
};

export const login = async (email, password) => {
  try {
    const res = await signInWithEmailAndPassword(
      safeAuth(),
      email,
      password
    );
    return res.user;
  } catch (error) {
    console.log("Login error:", error);
    throw error;
  }
};

export const register = async (email, password, name, role, faculty, classCode = null) => {
  try {
    const res = await createUserWithEmailAndPassword(
      safeAuth(),
      email,
      password
    );

    await setDoc(doc(safeDb(), "users", res.user.uid), {
      uid: res.user.uid,
      email,
      name,
      role,
      faculty,
      classCode,
      createdAt: new Date().toISOString()
    });

    return res.user;
  } catch (error) {
    console.log("Register error:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    return await signOut(safeAuth());
  } catch (e) {
    console.log("Logout error:", e);
  }
};

export const getUserRole = async (uid) => {
  try {
    const snap = await getDoc(doc(safeDb(), "users", uid));
    return snap.exists() ? snap.data().role : null;
  } catch (e) {
    console.log("getUserRole error:", e);
    return null;
  }
};