import FormatQuoteRoundedIcon from "@mui/icons-material/FormatQuoteRounded";
import {
  Box,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import type { SocialProofCopy } from "@/i18n/types";

type SocialProofSectionProps = {
  copy: SocialProofCopy;
};

export default function SocialProofSection({ copy }: SocialProofSectionProps) {
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
        backgroundColor: "#F5F2EB",
      }}
    >
      <Container>
        <Stack spacing={{ xs: 5, md: 6 }}>
          <Stack spacing={2} maxWidth={{ md: 620 }}>
            <Typography variant="h2" id={headingId}>
              {copy.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" id={descriptionId}>
              {copy.subtitle}
            </Typography>
          </Stack>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 3, md: 4 }}
            alignItems="stretch"
          >
            {copy.stories.map((story) => (
              <Card
                key={story.name}
                elevation={0}
                sx={{
                  flex: 1,
                  border: "1px solid rgba(11, 35, 51, 0.08)",
                  background: "#FFFFFF",
                }}
              >
                <CardContent sx={{ p: { xs: 4, md: 4.5 }, height: "100%" }}>
                  <Stack spacing={2.5} height="100%">
                    <FormatQuoteRoundedIcon color="secondary" fontSize="large" />
                    <Typography variant="body1" color="text.primary">
                      {story.quote}
                    </Typography>
                    <Stack spacing={0.5} mt="auto">
                      <Typography variant="subtitle1">{story.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {story.role}
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
          {copy.disclaimer && (
            <Typography variant="caption" color="text.secondary">
              {copy.disclaimer}
            </Typography>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
