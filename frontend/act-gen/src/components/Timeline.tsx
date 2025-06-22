import { Box, Card, CardContent, Typography, Stepper, Step, StepLabel, CircularProgress } from '@mui/material';

interface TimelineStep {
  id: string;
  label: string;
  status: 'pending' | 'running' | 'done' | 'failed';
}

interface TimelineProps {
  steps: TimelineStep[];
}

export default function Timeline({ steps }: TimelineProps) {
  const getStepIcon = (status: TimelineStep['status']) => {
    if (status === 'running') {
      return <CircularProgress size={24} />;
    }
    return undefined; // Let MUI handle default icons
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Execution Timeline
        </Typography>
        <Box sx={{ width: '100%' }}>
          <Stepper activeStep={steps.findIndex(step => step.status === 'running')} alternativeLabel>
            {steps.map((step) => (
              <Step key={step.id} completed={step.status === 'done'}>
                <StepLabel
                  error={step.status === 'failed'}
                  icon={getStepIcon(step.status)}
                >
                  {step.label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      </CardContent>
    </Card>
  );
}
