import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import type { JourneyCopy } from "@/i18n/types";

type JourneySectionProps = {
  copy: JourneyCopy;
};

export default function JourneySection({ copy }: JourneySectionProps) {
  const headingId = `${copy.id}-heading`;
  const descriptionId = `${copy.id}-description`;

  return (
    <Box
      component="section"
      id={copy.id}
      aria-labelledby={headingId}
      aria-describedby={descriptionId}
      sx={{
        py: { xs: 10, md: 14 },
        backgroundColor: "#FFFFFF",
      }}
    >
      <Container>
        <Stack spacing={6}>
          <Stack spacing={2} maxWidth={{ md: 640 }}>
            <Typography variant="h2" id={headingId}>
              {copy.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" id={descriptionId}>
              {copy.description}
            </Typography>
          </Stack>
          <Stack spacing={3}>
            {copy.steps.map((step, index) => (
              <Card
                key={step.title}
                elevation={0}
                sx={{
                  border: "1px solid rgba(11, 35, 51, 0.08)",
                  position: "relative",
                }}
              >
                <CardContent sx={{ p: { xs: 4, md: 5 } }}>
                  <Stack spacing={2.5}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Chip
                        color="primary"
                        variant="outlined"
                        label={`${index + 1}`}
                        sx={{ minWidth: 40, justifyContent: "center", fontWeight: 600 }}
                      />
                      <Typography variant="h4">{step.title}</Typography>
                    </Stack>
                    <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 620 }}>
                      {step.description}
                    </Typography>
                  </Stack>
                </CardContent>
                {index < copy.steps.length - 1 && (
                  <ChevronRightRoundedIcon
                    fontSize="large"
                    color="primary"
                    sx={{
                      position: "absolute",
                      top: "50%",
                      right: { xs: 12, md: -28 },
                      transform: "translateY(-50%)",
                      display: { xs: "none", md: "block" },
                    }}
                  />
                )}
              </Card>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
