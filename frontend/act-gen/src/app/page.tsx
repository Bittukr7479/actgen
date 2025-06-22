'use client';

import { useState, useEffect } from 'react';
import { Box, Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Header from '@/components/Header';
import TaskInput from '@/components/TaskInput';
import TaskBreakdown from '@/components/TaskBreakdown';
import Timeline from '@/components/Timeline';
import { apiClient } from '@/services/api-client';

interface TaskState {
	id: string;
	instruction: string;
	status: string;
	subTasks: Array<{
		id: string;
		name: string;
		status: 'pending' | 'running' | 'done' | 'failed';
	}>;
	timelineSteps: Array<{
		id: string;
		label: string;
		status: 'pending' | 'running' | 'done' | 'failed';
	}>;
}

export default function Home() {
	const [darkMode, setDarkMode] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [currentTask, setCurrentTask] = useState<TaskState | null>(null);

	const theme = createTheme({
		palette: {
			mode: darkMode ? 'dark' : 'light',
		},
	});

	useEffect(() => {
		if (currentTask) {
			const interval = setInterval(async () => {
				try {
					const status = await apiClient.getTaskStatus(currentTask.id);

					// Update task state based on status
					setCurrentTask((prev) => {
						if (!prev) return null;
						return {
							...prev,
							status: status.status,
							subTasks: status.logs
								.filter((log) => log.level === 'subtask')
								.map((log) => ({
									id: log.timestamp,
									name: log.message,
									status: getStatusFromLog(log),
								})),
							timelineSteps: status.logs
								.filter((log) => log.level === 'step')
								.map((log) => ({
									id: log.timestamp,
									label: log.message,
									status: getStatusFromLog(log),
								})),
						};
					});

					// Clear interval if task is done or failed
					if (status.status === 'done' || status.status === 'failed') {
						clearInterval(interval);
					}
				} catch (error) {
					console.error('Error fetching task status:', error);
				}
			}, 2000);

			return () => clearInterval(interval);
		}
	}, [currentTask?.id]);

	const getStatusFromLog = (log: { level: string; message: string }) => {
		if (
			log.message.toLowerCase().includes('completed') ||
			log.message.toLowerCase().includes('done')
		) {
			return 'done' as const;
		}
		if (
			log.message.toLowerCase().includes('failed') ||
			log.message.toLowerCase().includes('error')
		) {
			return 'failed' as const;
		}
		if (
			log.message.toLowerCase().includes('started') ||
			log.message.toLowerCase().includes('processing')
		) {
			return 'running' as const;
		}
		return 'pending' as const;
	};

	const handleTaskSubmit = async (instruction: string) => {
		setIsSubmitting(true);
		try {
			const response = await apiClient.createTask(instruction);
			setCurrentTask({
				id: response.task_id,
				instruction,
				status: response.status,
				subTasks: [{ id: '1', name: 'Analyzing instruction...', status: 'running' }],
				timelineSteps: [
					{ id: '1', label: 'Task Initialization', status: 'done' },
					{ id: '2', label: 'Natural Language Processing', status: 'running' },
					{ id: '3', label: 'Action Planning', status: 'pending' },
					{ id: '4', label: 'Execution', status: 'pending' },
				],
			});
		} catch (error) {
			console.error('Error submitting task:', error);
		} finally {
			setIsSubmitting(false);
		}
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
						pt: { xs: 10, sm: 12 },
						pb: 3,
					}}
				>
					<Container maxWidth="md">
						<TaskInput onSubmit={handleTaskSubmit} isSubmitting={isSubmitting} />
						{currentTask && (
							<>
								<TaskBreakdown subTasks={currentTask.subTasks} />
								<Timeline steps={currentTask.timelineSteps} />
							</>
						)}
					</Container>
				</Box>
			</Box>
		</ThemeProvider>
	);
}
