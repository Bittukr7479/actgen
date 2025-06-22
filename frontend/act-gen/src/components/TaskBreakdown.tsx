import { Card, CardContent, Typography, List, ListItem, ListItemIcon, ListItemText, Chip } from '@mui/material';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

interface SubTask {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'done' | 'failed';
}

interface TaskBreakdownProps {
  subTasks: SubTask[];
}

export default function TaskBreakdown({ subTasks }: TaskBreakdownProps) {  const getStatusColor = (status: SubTask['status']) => {
    const colors: Record<SubTask['status'], 'default' | 'primary' | 'success' | 'error'> = {
      pending: 'default',
      running: 'primary',
      done: 'success',
      failed: 'error'
    };
    return colors[status];
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Task Breakdown
        </Typography>
        <List>
          {subTasks.map((task) => (
            <ListItem key={task.id}>
              <ListItemIcon>
                <TaskAltIcon color={task.status === 'done' ? 'success' : 'inherit'} />
              </ListItemIcon>
              <ListItemText primary={task.name} />
              <Chip
                label={task.status}
                color={getStatusColor(task.status)}
                size="small"
                sx={{ textTransform: 'capitalize' }}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
