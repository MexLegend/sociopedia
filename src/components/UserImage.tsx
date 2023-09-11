import { Box } from "@mui/material";

const UserImage = ({ image, size = "60px" }: { image: string, size?: string }) => {
  return (
    <Box width={size} height={size}>
      <img
        style={{ objectFit: "cover", borderRadius: "50%" }}
        width={size}
        height={size}
        alt="user"
        src={`${process.env.REACT_APP_API}/assets/${image}`}
      />
    </Box>
  );
};

export default UserImage;