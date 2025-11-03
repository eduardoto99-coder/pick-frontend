import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import type { HeroCopy } from "@/i18n/types";

type HeroSectionProps = {
  copy: HeroCopy;
};

export default function HeroSection({ copy }: HeroSectionProps) {
  return (
    <Box
      component="section"
      id={copy.id}
      sx={{
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(140deg, #F5F2EB 35%, rgba(21, 148, 154, 0.12))",
        py: { xs: 10, md: 16 },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          insetInlineEnd: { xs: "-40%", md: "-15%" },
          top: { xs: "-10%", md: "auto" },
          bottom: { xs: "auto", md: "-25%" },
          width: { xs: "70%", md: "45%" },
          height: { xs: "70%", md: "60%" },
          background: "radial-gradient(circle at center, rgba(249, 140, 91, 0.35), transparent 70%)",
          zIndex: 0,
        }}
      />
      <Container sx={{ position: "relative", zIndex: 1 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 6, lg: 10 }}
          alignItems={{ xs: "stretch", md: "center" }}
        >
          <Box flex={{ xs: 1, md: 1 }} maxWidth={{ md: 540 }}>
            <Stack spacing={3}>
              <Stack spacing={1.5}>
                <Typography variant="h1">{copy.title}</Typography>
                <Typography variant="body1" color="text.secondary">
                  {copy.description}
                </Typography>
              </Stack>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                alignItems={{ xs: "stretch", sm: "center" }}
              >
                <Button
                  component="a"
                  href={copy.primaryCta.href}
                  variant="contained"
                  color="primary"
                  size="large"
                >
                  {copy.primaryCta.label}
                </Button>
                <Button
                  component="a"
                  href={copy.secondaryCta.href}
                  variant="outlined"
                  color="primary"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                >
                  {copy.secondaryCta.label}
                </Button>
              </Stack>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 1.5, sm: 2.5 }}>
                {copy.differentiators.map((item) => (
                  <Stack
                    key={item}
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ color: "text.secondary" }}
                  >
                    <CheckCircleRoundedIcon color="primary" fontSize="small" />
                    <Typography variant="subtitle1">{item}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </Box>
          <Box flex={{ xs: 1, md: 1 }} maxWidth={{ md: 460 }}>
            <Card
              elevation={0}
              sx={{
                background: "#FFFFFF",
                border: "1px solid rgba(11, 35, 51, 0.08)",
                boxShadow: "0px 24px 48px rgba(11, 35, 51, 0.08)",
              }}
            >
              <CardContent sx={{ p: { xs: 4, md: 5 } }}>
                <Stack spacing={3}>
                  <Typography variant="h4" color="text.primary">
                    {copy.cardTitle}
                  </Typography>
                  <Divider />
                  <Stack spacing={2}>
                    {copy.cardPoints.map((point) => (
                      <Stack key={point} direction="row" spacing={1.5} alignItems="flex-start">
                        <CheckCircleRoundedIcon color="primary" fontSize="small" />
                        <Typography variant="body2" color="text.secondary">
                          {point}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
