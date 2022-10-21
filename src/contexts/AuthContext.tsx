import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";
import { Button } from "flowbite-react";
import React, { createContext, useEffect, useState } from "react";
import { auth } from "../API/firebaseApp";

const provider = new GoogleAuthProvider();
export const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export interface ICurrentUser {
  userUid: string;
  email: string | null;
  displayName: string | null;
}

interface IAuthContext {
  currentUser: ICurrentUser;
  logout: ()=>void;
}
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<ICurrentUser>();
  useEffect(() => {
    onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        setCurrentUser({
          userUid: user.uid,
          email: user.email,
          displayName: user.displayName,
        });
      }
    });
  }, []);

  const login = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
  
        const user = result.user;
        console.log({ credential, token, user });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log({ errorCode, errorMessage, email, credential });
      });
  };
  
  const logout = () => {
    auth.signOut();
    setCurrentUser(undefined)
  };

  return (
    <>
      {currentUser ? (
        <AuthContext.Provider value={{ currentUser: currentUser, logout: logout }}>
          {children}
        </AuthContext.Provider>
      ) : (
        <Button onClick={login}>Login</Button>
      )}
    </>
  );
};
