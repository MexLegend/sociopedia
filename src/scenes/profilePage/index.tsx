import { Box, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useAppSelector } from "redux/hooks";
import { User } from "redux/slice";
import { useParams } from "react-router-dom";
import Navbar from "scenes/navbar";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import UserWidget from "scenes/widgets/UserWidget";

const ProfilePage = () => {
    const [user, setUser] = useState<User | null>(null);
    const { userId } = useParams();
    const token = useAppSelector((state) => state.token);
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

    const getUser = async () => {
        const response = await fetch(`${process.env.REACT_APP_API}/api/users/${userId}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const { user }: { user: User } = await response.json();
        setUser(user);
    };

    useEffect(() => {
        getUser();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (!user) return null;

    return (
        <Box>
            <Navbar />
            <Box
                width="100%"
                padding="2rem 6%"
                display={isNonMobileScreens ? "flex" : "block"}
                gap="2rem"
                justifyContent="center"
            >
                <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
                    <UserWidget userId={userId!} imgPath={user.imgPath} />
                    <Box m="2rem 0" />
                    <FriendListWidget userId={userId!} />
                </Box>
                <Box
                    flexBasis={isNonMobileScreens ? "42%" : undefined}
                    mt={isNonMobileScreens ? undefined : "2rem"}
                >
                    <MyPostWidget imgPath={user.imgPath} />
                    <Box m="2rem 0" />
                    <PostsWidget userId={userId!} isProfile />
                </Box>
            </Box>
        </Box>
    );
};

export default ProfilePage;