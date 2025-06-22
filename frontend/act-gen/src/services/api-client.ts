import axios, { AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface TaskResponse {
  task_id: string;
  status: string;
  agent_id: string;
}

export interface TaskStatus {
  task_id: string;
  status: string;
  progress: number;
  logs: Array<{
    timestamp: string;
    message: string;
    level: string;
  }>;
  last_update: string;
}

interface ApiError {
  detail?: string;
  message?: string;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class RetryError extends Error {
  constructor() {
    super('RETRY');
    this.name = 'RetryError';
  }
}

const handleApiError = async (error: unknown, retryCount = 0): Promise<never> => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;
    
    // Handle network errors with retry
    if (!axiosError.response) {
      if (retryCount < 3) {
        console.log(`Retrying request (attempt ${retryCount + 1})...`);
        await delay(1000 * Math.pow(2, retryCount)); // Exponential backoff
        throw new RetryError();
      }
      throw new Error(
        'Cannot connect to the server. Please check if:\n' +
        '1. The backend server is running (should be at http://localhost:8000)\n' +
        '2. Your network connection is working\n' +
        '3. Any firewall or security software is not blocking the connection'
      );
    }

    // Handle other API errors
    const message = axiosError.response.data?.detail || axiosError.response.data?.message || axiosError.message;
    throw new Error(`API Error: ${message}`);
  }
  throw error;
};

export const apiClient = {
  async createTask(instruction: string, retryCount = 0): Promise<TaskResponse> {
    try {
      const response = await axiosInstance.post<TaskResponse>('/task', {
        instruction,
      });
      return response.data;
    } catch (error) {
      try {
        await handleApiError(error, retryCount);
      } catch (e) {
        if (e instanceof RetryError) {
          return this.createTask(instruction, retryCount + 1);
        }
        throw e;
      }
      throw error; // TypeScript needs this, but it will never be reached
    }
  },

  async getTaskStatus(taskId: string, retryCount = 0): Promise<TaskStatus> {
    try {
      const response = await axiosInstance.get<TaskStatus>(`/task/${taskId}`);
      return response.data;
    } catch (error) {
      try {
        await handleApiError(error, retryCount);
      } catch (e) {
        if (e instanceof RetryError) {
          return this.getTaskStatus(taskId, retryCount + 1);
        }
        throw e;
      }
      throw error; // TypeScript needs this, but it will never be reached
    }
  },
};
