import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { TEMPORARY_REDIRECT_STATUS } from "next/dist/shared/lib/constants";
import {
    auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
} from "../config/Firebase";
import axios from "axios";




export const signupUser = createAsyncThunk('authUser/signupUser', async (user: any) => {
    try {
        // const user = await createUserWithEmailAndPassword(auth, item.email, item.password)
        const signupUser = await axios.post("http://localhost:8000/signupUser", { user })
        console.log("the user i singup", signupUser);
        return user
    }
    catch (e) {
        console.log("error in singup user", e);
    }




})
export const loginUser = createAsyncThunk('auth/loginUser', async (loginedUser: any) => {
    // console.log("login", email, password);
    console.log("the logined user", loginedUser);

    try {
        // const user = await signInWithEmailAndPassword(auth, email, password)
        const user = await axios.post("http://localhost:8000/loginUser", { loginedUser })
        console.log("user dasta is", user.data[0]);
        const userData = user.data[0]
        console.log("UserData", userData);
        return userData
    }
    catch (e) {
        console.log("login error", e);

    }

})
export const signOutUser = createAsyncThunk('auth/signOutUser', async () => {

    try {
        console.log("signoutuser is working");
        await auth.signOut();
    }
    catch (e) {
        console.log("singOut error", e)

    }

})



const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: {},
        isLoggedIn: false,
        error: null,
        signupUser: {},
        currentUserRequestLoader: true,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(signupUser.fulfilled, (state, action) => {
            let newState: any = {
                ...state,
                signupUser: action.payload,
            };
            console.log("newState after signup", newState);

            return newState;
        });
        builder.addCase(loginUser.fulfilled, (state, action) => {
            console.log("the user at login is", action.payload);
            if (action.payload) {
                let newState: any = {
                    ...state,
                    user: action.payload,
                    isLoggedIn: true,
                    currentUserRequestLoader: false /*this is extra*/
                };
                console.log("user after login", newState.user);

                return newState;
            }

            return {
                ...state
            };
        });

        builder.addCase(signOutUser.fulfilled, (state, action) => {
            console.log("signoutuser in extra reducer");
            let newState = {
                user: {},
                isLoggedIn: false,
                error: null,
                signupUser: {},
                currentUserRequestLoader: true,
            }
            console.log("the new state is", newState);
            return newState
        })
    }

})

export default authSlice.reducer