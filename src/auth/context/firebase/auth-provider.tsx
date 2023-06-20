'use client';

import { ActionMapType, AuthStateType, AuthUserType } from '../../types';
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  TwitterAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { collection, doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { useCallback, useEffect, useMemo, useReducer } from 'react';

import { AuthContext } from './auth-context';
import { FIREBASE_API } from 'src/config-global';
import axios from 'axios';
import { initializeApp } from 'firebase/app';

// config

//




// ----------------------------------------------------------------------

// NOTE:
// We only build demo at basic level.
// Customer will need to do some extra handling yourself if you want to extend the logic and other features...

// ----------------------------------------------------------------------

const firebaseApp = initializeApp(FIREBASE_API);

const AUTH = getAuth(firebaseApp);

const DB = getFirestore(firebaseApp);

// ----------------------------------------------------------------------

enum Types {
  INITIAL = 'INITIAL',
}

type Payload = {
  [Types.INITIAL]: {
    user: AuthUserType;
  };
};

type Action = ActionMapType<Payload>[keyof ActionMapType<Payload>];

const initialState: AuthStateType = {
  user: null,
  loading: true,
};

const reducer = (state: AuthStateType, action: Action) => {
  if (action.type === Types.INITIAL) {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(() => {
    try {
      onAuthStateChanged(AUTH, async (user) => {
        if (user) {
            sessionStorage.setItem('uid',user.uid)
            user.getIdToken().then((data)=>{
              sessionStorage.setItem("token", data)
            });
          // if (user.emailVerified) {
            const userProfile = doc(DB, 'users', user.uid);

            const docSnap = await getDoc(userProfile);

            const profile = docSnap.data();

            dispatch({
              type: Types.INITIAL,
              payload: {
                user: {
                  ...user,
                  ...profile,
                  id: user.uid,
                  role: 'admin',
                },
              },
            });

          // } else {
          //   dispatch({
          //     type: Types.INITIAL,
          //     payload: {
          //       user: null,
          //     },
          //   });
          // }
        } else {
          dispatch({
            type: Types.INITIAL,
            payload: {
              user: null,
            },
          });
        }
      });
    } catch (error) {
      console.error(error);
      dispatch({
        type: Types.INITIAL,
        payload: {
          user: null,
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(AUTH, email, password);
  }, []);

  const loginWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();

    await signInWithPopup(AUTH, provider);
  }, []);

  const loginWithGithub = useCallback(async () => {
    const provider = new GithubAuthProvider();

    await signInWithPopup(AUTH, provider);
  }, []);

  const loginWithTwitter = useCallback(async () => {
    const provider = new TwitterAuthProvider();

    await signInWithPopup(AUTH, provider);
  }, []);

  interface org {
    name: string;
    email: string;
    address: string;
    taxNumber: string;
  }
  // REGISTER
  const register = useCallback(
    async (
      email: string,
      phoneNumber: string,
      fullName: string,
      password: string,
      role: string,
      organization: org
    ) => {
      // const newUser = await createUserWithEmailAndPassword(AUTH, email, password);

      // await sendEmailVerification(newUser.user);

      // const userProfile = doc(collection(DB, 'users'), newUser.user?.uid);
      // await setDoc(userProfile, {
      //   uid: newUser.user?.uid,
      //   email,
      //   displayName: `${firstName} ${lastName}`,
      // });
      const body = {
        email,
        phoneNumber,
        fullName,
        password,
        role,
        organization,
      };
      try {
        await axios.post('http://34.172.143.101/ass-admin/auth', body);
      } catch (error) {
        console.error(error);
      }
    },
    []
  );

  // LOGOUT
  const logout = useCallback(async () => {
    sessionStorage.clear();
    await signOut(AUTH);
  }, []);

  // FORGOT PASSWORD
  const forgotPassword = useCallback(async (email: string) => {
    await sendPasswordResetEmail(AUTH, email);
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'firebase',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      //
      login,
      logout,
      register,
      forgotPassword,
      loginWithGoogle,
      loginWithGithub,
      loginWithTwitter,
    }),
    [
      status,
      state.user,
      //
      login,
      logout,
      register,
      forgotPassword,
      loginWithGithub,
      loginWithGoogle,
      loginWithTwitter,
    ]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
