// components/PageLoader.jsx
import { Box, CircularProgress } from "@mui/material";

export default function PageLoader() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        bgcolor: "var(--bg)",
      }}
    >
      <CircularProgress sx={{ color: "var(--blue)" }} />
    </Box>
  );
}
