export interface User {
  id: number;
  name: string;
  email: string;
  joinDate: string;
  status: 'active' | 'inactive';
  role: 'admin' | 'user' | 'manager';
}

export const mockUsers: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    joinDate: '2024-01-01',
    status: 'active',
    role: 'admin'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    joinDate: '2024-01-05',
    status: 'inactive',
    role: 'user'
  },
];
