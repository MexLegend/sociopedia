import {
    AttachFileOutlined,
    GifBoxOutlined,
    ImageOutlined,
    MicOutlined,
    MoreHorizOutlined,
    ClearOutlined,
} from "@mui/icons-material";
import {
    Box,
    Divider,
    Typography,
    InputBase,
    useTheme,
    Button,
    useMediaQuery,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import UserImage from "components/UserImage";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setPosts } from "redux/slice";
import { Post } from '../../redux/slice';
import UploadWidget from "components/UploadWidget";

const MyPostWidget = ({ imgPath }: { imgPath: string }) => {

    const dispatch = useAppDispatch();
    const [isImage, setIsImage] = useState(false);
    const [image, setImage] = useState<string | null>(null);
    const [post, setPost] = useState("");
    const { palette } = useTheme();
    const { _id } = useAppSelector((state) => state.user!);
    const token = useAppSelector((state) => state.token);
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const mediumMain = palette.neutral.mediumMain;
    const medium = palette.neutral.medium;

    const handleUpload = (error: any, result: any, widget: any) => {
        if (error) {
            console.log(error);

            widget.close({
                quiet: true
            });

            return;
        }
        setImage(result.info.secure_url);
    }

    const handleDeleteImage = async (event: React.MouseEvent) => {

        event.stopPropagation();

        const publicId = image?.split('ReactWeb1').pop()?.split(".")[0];

        const deleteResponse = await fetch(`${process.env.REACT_APP_API}/api/cloudinary/ReactWeb1${publicId}`, {
            method: "DELETE"
        });

        const isDeleted = await deleteResponse.json();

        if (isDeleted.ok) {
            setImage(null);
        }
    }

    const handlePost = async () => {

        const bodyPayload = {
            userId: _id,
            description: post,
            imgPath: image
        }

        const response = await fetch(`${process.env.REACT_APP_API}/api/posts`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyPayload)
        });

        const { posts }: { posts: Post[] } = await response.json();
        dispatch(setPosts(posts));
        setImage(null);
        setIsImage(false);
        setPost("");
    };

    return (
        <WidgetWrapper>
            <FlexBetween gap="1.5rem">
                <UserImage image={imgPath} />
                <InputBase
                    placeholder="What's on your mind..."
                    onChange={(e) => setPost(e.target.value)}
                    value={post}
                    sx={{
                        width: "100%",
                        backgroundColor: palette.neutral.light,
                        borderRadius: "2rem",
                        padding: "1rem 2rem",
                    }}
                />
            </FlexBetween>
            {isImage && (
                <Box
                    border={`1px solid ${medium}`}
                    borderRadius="5px"
                    mt="1rem"
                    p="1rem"
                >
                    <UploadWidget
                        options={{ maxFiles: 1, folder: "ReactWeb1" }}
                        onUpload={(error: any, result: any, widget: any) => handleUpload(error, result, widget)}
                        uploadPreset="react_web_1"
                        disabled={!!image}
                    >
                        {!image ? (
                            <Button
                                type="button"
                                sx={{
                                    p: ".5rem 1rem",
                                    backgroundColor: palette.primary.main,
                                    color: palette.background.alt,
                                    "&:hover": { backgroundColor: '#03b7d6' },
                                }}
                            >
                                Select image
                            </Button>
                        ) : (
                            <FlexBetween>
                                <img
                                    src={image}
                                    alt="avatars"
                                    width={60}
                                    height={60}
                                    style={{
                                        borderRadius: 9999,
                                        border: `1px solid ${palette.neutral.medium}`,
                                        overflow: "clip"
                                    }}
                                />
                                <Button
                                    type="button"
                                    sx={{
                                        p: ".3rem",
                                        pointerEvents: 'auto',
                                        minWidth: 'max-content',
                                        borderRadius: 9999,
                                        backgroundColor: 'transparent',
                                        color: mediumMain,
                                        "&:hover": { backgroundColor: '#03b7d6', color: 'white' },
                                    }}
                                    onClick={handleDeleteImage}
                                >
                                    <ClearOutlined />
                                </Button>
                            </FlexBetween>
                        )}
                    </UploadWidget>
                </Box>
            )}

            <Divider sx={{ margin: "1.25rem 0" }} />

            <FlexBetween>
                <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
                    <ImageOutlined sx={{ color: mediumMain }} />
                    <Typography
                        color={mediumMain}
                        sx={{ "&:hover": { cursor: "pointer", color: medium } }}
                    >
                        Image
                    </Typography>
                </FlexBetween>

                {isNonMobileScreens ? (
                    <>
                        <FlexBetween gap="0.25rem">
                            <GifBoxOutlined sx={{ color: mediumMain }} />
                            <Typography color={mediumMain}>Clip</Typography>
                        </FlexBetween>

                        <FlexBetween gap="0.25rem">
                            <AttachFileOutlined sx={{ color: mediumMain }} />
                            <Typography color={mediumMain}>Attachment</Typography>
                        </FlexBetween>

                        <FlexBetween gap="0.25rem">
                            <MicOutlined sx={{ color: mediumMain }} />
                            <Typography color={mediumMain}>Audio</Typography>
                        </FlexBetween>
                    </>
                ) : (
                    <FlexBetween gap="0.25rem">
                        <MoreHorizOutlined sx={{ color: mediumMain }} />
                    </FlexBetween>
                )}

                <Button
                    disabled={!post}
                    onClick={handlePost}
                    sx={{
                        color: palette.background.alt,
                        backgroundColor: palette.primary.main,
                        borderRadius: "3rem",
                        ":disabled": { color: "rgba(255, 255, 255, 0.8)" }
                    }}
                >
                    POST
                </Button>
            </FlexBetween>
        </WidgetWrapper>
    );
};

export default MyPostWidget;