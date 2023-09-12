import { Box } from '@mui/material';
import { styled } from '@mui/system';

const FlexBetween = styled(Box)({
    display: "flex",
    justifyContent: "space-between",
    gap: '4px',
    alignItems: "center"
});

export default FlexBetween;