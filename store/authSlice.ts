import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { TEMPORARY_REDIRECT_STATUS } from "next/dist/shared/lib/constants";
import {
    auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
} from "../config/Firebase";


export const fetchCurrentUser = createAsyncThunk(
    "auth/checkUserSignIn",
    async () => {
        try {
            const user = await new Promise((resolve, reject) => {
                const unsubscribe = onAuthStateChanged(auth, (user) => {
                    if (user) {
                        console.log("onAuthStateChanged", user);
                        let loggedInuser = {
                            email: user?.email,
                            id: user?.uid
                        }
                        resolve(user);
                    } else {
                        resolve(false);
                    }
                });
                unsubscribe();
            });
            console.log("user is", user);

            return { user }; // return a fulfilled action with the user object
        } catch (error) {
            return { error }; // return a rejected action with the error object
        }
    }
);

export const signupUser = createAsyncThunk('authUser/signupUser', async (item: any) => {
    try {
        const user = await createUserWithEmailAndPassword(auth, item.email, item.password)
        console.log("the user i singup", user);
        return user
    }
    catch (e) {
        console.log("error in singup user", e);
    }




})
export const loginUser = createAsyncThunk('auth/loginUser', async ({ email, password }: any) => {
    console.log("login", email, password);
    try {
        const user = await signInWithEmailAndPassword(auth, email, password)
        return user
    }
    catch (e) {
        alert("login error")

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
            console.log("the user at login is", action.payload?.user);
            if (action.payload?.user) {
                let newState: any = {
                    ...state,
                    user: action.payload?.user,
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
        builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
            console.log("newState after current user start", action.payload.user);

            if (action.payload) {
                if (action.payload?.user) {
                    let newState: any = {
                        ...state,
                        user: action.payload?.user,
                        isLoggedIn: true,
                        currentUserRequestLoader: false
                    };
                    console.log("newState after current user", newState);

                    return newState;
                }
                else {
                    console.log("false");
                    let newState: any = {
                        ...state,
                    }
                    console.log("false state", newState);
                    return newState
                }
            }
            return {
                ...state,
                currentUserRequestLoader: false
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