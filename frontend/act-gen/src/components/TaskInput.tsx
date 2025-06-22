import { useState } from 'react';
import { TextField, Button, Box, Paper, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface TaskInputProps {
  onSubmit: (task: string) => Promise<void>;
  isSubmitting?: boolean;
}

export default function TaskInput({ onSubmit, isSubmitting = false }: TaskInputProps) {
  const [task, setTask] = useState('');

  const handleSubmit = async () => {
    if (task.trim()) {
      await onSubmit(task);
      setTask('');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Enter your task (e.g., 'Book a cab tomorrow at 10 AM and remind me')"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !isSubmitting && handleSubmit()}
          disabled={isSubmitting}
        />
        <Button
          variant="contained"
          color="primary"
          endIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
          onClick={handleSubmit}
          disabled={!task.trim() || isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </Box>
    </Paper>
  );
}
