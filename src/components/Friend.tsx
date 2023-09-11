import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { useNavigate } from "react-router-dom";
import { setFriends, User } from '../redux/slice';
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";

interface Friend {
    friendId: string;
    name: string;
    subtitle: string;
    userImgPath: string;
}

const Friend = ({ friendId, name, subtitle, userImgPath }: Friend) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { _id } = useAppSelector((state) => state.user!);
    const token = useAppSelector((state) => state.token);
    const friends = useAppSelector((state) => state.user!.friends);

    const { palette } = useTheme();
    const primaryLight = palette.primary.light;
    const primaryDark = palette.primary.dark;
    const main = palette.neutral.main;
    const medium = palette.neutral.medium;

    const isFriend = friends?.find((friend) => friend._id === friendId);

    const patchFriend = async () => {
        const response = await fetch(
            `${process.env.REACT_APP_API}/api/users/${_id}/${friendId}`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        const { formatedFriends }: { formatedFriends: User[] } = await response.json();
        dispatch(setFriends(formatedFriends));
    };

    return (
        <FlexBetween>
            <FlexBetween gap="1rem">
                <UserImage image={userImgPath} size="55px" />
                <Box
                    onClick={() => {
                        navigate(`/profile/${friendId}`);
                        navigate(0);
                    }}
                >
                    <Typography
                        color={main}
                        variant="h5"
                        fontWeight="500"
                        sx={{
                            "&:hover": {
                                color: palette.primary.light,
                                cursor: "pointer",
                            },
                        }}
                    >
                        {name}
                    </Typography>
                    <Typography color={medium} fontSize="0.75rem">
                        {subtitle}
                    </Typography>
                </Box>
            </FlexBetween>
            {friendId !== _id && (
                <IconButton
                    onClick={() => patchFriend()}
                    sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
                >
                    {isFriend ? (
                        <PersonRemoveOutlined sx={{ color: primaryDark }} />
                    ) : (
                        <PersonAddOutlined sx={{ color: primaryDark }} />
                    )}
                </IconButton>
            )}
        </FlexBetween>
    );
};

export default Friend;