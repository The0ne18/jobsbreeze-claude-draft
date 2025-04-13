export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: Record<string, unknown>;
} 