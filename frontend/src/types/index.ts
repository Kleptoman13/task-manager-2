export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  deadline: string | null;
  notified: boolean;
  created_at: string;
  updated_at: string;
}
