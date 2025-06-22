'use client';

import { useState } from 'react';
import { Box, Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Header from '@/components/Header';
import TaskInput from '@/components/TaskInput';
import TaskBreakdown from '@/components/TaskBreakdown';
import Timeline from '@/components/Timeline';

// Mock data for demonstration
const mockSubTasks: { id: string; name: string; status: 'pending' | 'running' | 'done' | 'failed' }[] = [
	{ id: '1', name: 'Parse natural language command', status: 'done' },
	{ id: '2', name: 'Find available cab services', status: 'running' },
	{ id: '3', name: 'Book cab', status: 'pending' },
	{ id: '4', name: 'Set reminder', status: 'pending' },
];

const mockTimelineSteps: { id: string; label: string; status: 'done' | 'running' | 'pending' | 'failed' }[] = [
	{ id: '1', label: 'Natural Language Processing', status: 'done' },
	{ id: '2', label: 'Service Discovery', status: 'running' },
	{ id: '3', label: 'Booking Process', status: 'pending' },
	{ id: '4', label: 'Reminder Setup', status: 'pending' },
];

export default function Home() {
	const [darkMode, setDarkMode] = useState(false);

	const theme = createTheme({
		palette: {
			mode: darkMode ? 'dark' : 'light',
		},
	});

	const handleTaskSubmit = (task: string) => {
		console.log('Submitted task:', task);
		// Here you would typically send the task to your backend
	};

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
				<Header
					darkMode={darkMode}
					onToggleTheme={() => setDarkMode(!darkMode)}
				/>
				<Box
					component="main"
					sx={{
						flexGrow: 1,
						pt: { xs: 10, sm: 12 }, // Adjusted for AppBar height
						pb: 3,
					}}
				>
					<Container maxWidth="md">
						<TaskInput onSubmit={handleTaskSubmit} />
						<TaskBreakdown subTasks={mockSubTasks} />
						<Timeline steps={mockTimelineSteps} />
					</Container>
				</Box>
			</Box>
		</ThemeProvider>
	);
}
