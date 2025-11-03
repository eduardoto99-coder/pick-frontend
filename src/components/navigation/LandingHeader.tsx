import Link from "next/link";
import { Box, Container, Typography } from "@mui/material";

export default function LandingHeader() {
  return (
    <Box
      component="header"
      sx={{
        py: { xs: 3, md: 4 },
      }}
    >
      <Container>
        <Link href="/es" style={{ textDecoration: "none" }}>
          <Typography
            variant="h4"
            sx={{
              fontFamily: "var(--font-sora)",
              fontWeight: 600,
              letterSpacing: "-0.04em",
              color: "primary.main",
            }}
          >
            Pick
          </Typography>
        </Link>
      </Container>
    </Box>
  );
}
