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
  email: string | undefined;
  displayName: string | undefined;
}

interface IAuthContext {
  currentUser: ICurrentUser;
  logout: () => void;
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
          email: user.email ? user.email: undefined,
          displayName: user.displayName ? user.displayName: undefined,
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
    setCurrentUser(undefined);
  };

  return (
    <div className="min-h-screen w-full bg-slate-800">
      {currentUser ? (
        <AuthContext.Provider
          value={{ currentUser: currentUser, logout: logout }}
        >
          {children}
        </AuthContext.Provider>
      ) : (
        <div className="container m-auto flex flex-col gap-4 items-center justify-center min-h-screen">
          <h1 className="text-3xl text-gray-300 font-bold">Faça o login para acessar sua agenda</h1>
          <Button onClick={login} type="button" style={{maxWidth: "8rem"}} >Login</Button>
        </div>
      )}
    </div>
  );
};
