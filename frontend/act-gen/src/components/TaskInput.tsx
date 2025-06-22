import { useState } from 'react';
import { TextField, Button, Box, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface TaskInputProps {
  onSubmit: (task: string) => void;
}

export default function TaskInput({ onSubmit }: TaskInputProps) {
  const [task, setTask] = useState('');

  const handleSubmit = () => {
    if (task.trim()) {
      onSubmit(task);
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
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
        />
        <Button
          variant="contained"
          color="primary"
          endIcon={<SendIcon />}
          onClick={handleSubmit}
          disabled={!task.trim()}
        >
          Submit
        </Button>
      </Box>
    </Paper>
  );
}
