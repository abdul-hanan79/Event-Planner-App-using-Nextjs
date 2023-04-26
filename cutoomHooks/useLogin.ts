import { async } from '@firebase/util'
import { auth, signInWithEmailAndPassword } from '../config/Firebase'

import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser, signOutUser } from '../store/authSlice'
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit'
import { RootState } from '../store/Store'
const useLogin = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loader, setLoader] = useState(false)
    const router = useRouter()
    const dispatch = useDispatch<ThunkDispatch<RootState, any, AnyAction>>();


    const auth = useSelector((state: any) => state.authSlice)
    // console.log("auth is login", auth.isLoggedIn);
    useEffect(() => {
        console.log("login.ts");
        if (auth.isLoggedIn) {
            router.push("/");
        }
        console.log("auth in login", auth.isLoggedIn);
    }, [auth])
    const onSubmitHandler = async () => {
        try {
            setLoader(true)
            const loginedUser={email,password}
            console.log("login user is",loginedUser);
            // const response = await signInWithEmailAndPassword(auth, email, password)
            await dispatch(loginUser(loginedUser))
            // console.log("response user+++++>", response.UserImpl.accessToken);
            router.push('/')
        }
        catch (e) {
            console.log("error in login", e);
        }
        finally {
            setLoader(false)
        }
    }
    const goToSignupPage = () => {
        console.log("go to signup page is working");
        router.push('/signup')
    }
    const gotoSignOut = async () => {
        console.log("signout=>");
        try {
            await dispatch(signOutUser())
            router.push("/")
        }
        catch (e) {
            console.log("error in sigout ", e);
        }

    }
    const goToHome = () => {
        router.push('/')
    }
    const goToLoginPage = () => {
        console.log("login function in navbar");

        router.push('/login')
    }

    return {
        email,
        setEmail,
        password,
        setPassword,
        loader,
        onSubmitHandler,
        goToSignupPage,
        gotoSignOut,
        goToHome,
        goToLoginPage

    }
}

export default useLogin
