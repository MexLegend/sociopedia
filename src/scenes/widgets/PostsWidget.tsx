import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { setPosts, Post } from "redux/slice";
import PostWidget from "./PostWidget";

const PostsWidget = ({ userId, isProfile = false }: { userId: string, isProfile?: boolean }) => {
    const dispatch = useAppDispatch();
    const posts = useAppSelector((state) => state.posts);
    const token = useAppSelector((state) => state.token);

    const getPosts = async () => {
        const response = await fetch(`${process.env.REACT_APP_API}/api/posts`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const { posts }: { posts: Post[] | [] } = await response.json();

        dispatch(setPosts(posts));
    };

    const getUserPosts = async () => {
        const response = await fetch(
            `${process.env.REACT_APP_API}/api/posts/${userId}/posts`,
            {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        const { posts }: { posts: Post[] | [] } = await response.json();
        dispatch(setPosts(posts));
    };

    useEffect(() => {
        if (isProfile) {
            getUserPosts();
        } else {
            getPosts();
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            {
                posts.length
                    ? posts.map(
                        ({
                            _id,
                            userId,
                            firstName,
                            lastName,
                            description,
                            location,
                            imgPath,
                            userImgPath,
                            likes,
                            comments,
                        }) => (
                            <PostWidget
                                key={_id}
                                postId={_id}
                                postUserId={userId}
                                name={`${firstName} ${lastName}`}
                                description={description}
                                location={location}
                                imgPath={imgPath}
                                userImgPath={userImgPath}
                                likes={likes}
                                comments={comments}
                            />
                        )
                    )
                    : <></>
            }
        </>
    );
};

export default PostsWidget;