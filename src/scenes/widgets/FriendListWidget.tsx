import { Box, Typography, useTheme } from "@mui/material";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setFriends, User } from "redux/slice";

const FriendListWidget = ({ userId }: { userId: string }) => {
    const dispatch = useAppDispatch();
    const { palette } = useTheme();
    const token = useAppSelector((state) => state.token);
    const friends = useAppSelector((state) => state.user!.friends);

    const getFriends = async () => {
        const response = await fetch(
            `${process.env.REACT_APP_API}/api/users/${userId}/friends`,
            {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        const { formatedFriends }: { formatedFriends: User[] | [] } = await response.json();

        dispatch(setFriends(formatedFriends));
    };

    useEffect(() => {
        getFriends();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <WidgetWrapper>
            <Typography
                color={palette.neutral.dark}
                variant="h5"
                fontWeight="500"
                sx={{ mb: "1.5rem" }}
            >
                Friend List
            </Typography>
            <Box display="flex" flexDirection="column" gap="1.5rem">
                {!!friends?.length
                    ? friends.map((friend) => (
                        <Friend
                            key={friend._id}
                            friendId={friend._id}
                            name={`${friend.firstName} ${friend.lastName}`}
                            subtitle={friend.occupation}
                            userImgPath={friend.imgPath}
                        />
                    ))
                    : <></>
                }
            </Box>
        </WidgetWrapper>
    );
};

export default FriendListWidget;