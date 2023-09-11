import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PaletteMode } from '@mui/material';

export interface Login {
    user: User | null,
    token: string | null
}

export interface User {
    firstName: string,
    lastName: string,
    friends: User[] | [],
    email: string,
    password: string,
    imgPath: string,
    location: string,
    occupation: string,
    viewedProfile: number,
    impressions: number,
    createdAt: Date,
    updatedAt: Date,
    _id: string
}

export type PostLike = {
    [key: string]: boolean
}

export interface Post {
    userId: string,
    firstName: string,
    lastName: string,
    imgPath: string,
    userImgPath: string,
    location: string,
    description: string,
    comments: Array<string>,
    likes: PostLike,
    createdAt: Date,
    updatedAt: Date,
    _id: string
}

export interface AuthState {
    mode: PaletteMode,
    user: User | null,
    token: string | null,
    posts: Array<Post>
}

const initialState: AuthState = {
    mode: "light",
    user: null,
    token: null,
    posts: []
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setMode: (state) => {
            state.mode = state.mode === "light" ? "dark" : "light";
        },
        setLogin: (state, { payload }: PayloadAction<Login>) => {
            state.user = payload.user;
            state.token = payload.token;
        },
        setLogout: (state) => {
            state.user = null;
            state.token = null;
        },
        setFriends: (state, { payload }: PayloadAction<User[]>) => {
            if (state.user) {
                state.user.friends = payload;
            } else {
                console.error("User friends non-existent :(");
            }
        },
        setPosts: (state, { payload }: PayloadAction<Post[]>) => {
            state.posts = payload;
        },
        setPost: (state, { payload }: PayloadAction<Post>) => {
            const updatedPosts = state.posts.map((post: Post) => {
                if (post._id === payload._id) return payload;
                return post;
            });

            state.posts = updatedPosts;
        }
    }
});

export const { setMode, setLogin, setLogout, setFriends, setPosts, setPost } = authSlice.actions;
export default authSlice.reducer;