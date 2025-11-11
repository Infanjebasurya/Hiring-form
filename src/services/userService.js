// src/services/userService.js

const STORAGE_KEY = 'admin_users';

// Get all users from localStorage
export const getUsers = () => {
  try {
    const users = localStorage.getItem(STORAGE_KEY);
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
};

// Save users to localStorage
export const saveUsers = (users) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    return true;
  } catch (error) {
    console.error('Error saving users:', error);
    return false;
  }
};

// Add a new user
export const addUser = (userData) => {
  const users = getUsers();
  const newUser = {
    id: Date.now(), // Simple ID generation
    ...userData,
    createdAt: new Date().toISOString(),
    status: 'active'
  };
  users.push(newUser);
  saveUsers(users);
  return newUser;
};

// Update user
export const updateUser = (userId, userData) => {
  const users = getUsers();
  const updatedUsers = users.map(user => 
    user.id === userId ? { ...user, ...userData } : user
  );
  saveUsers(updatedUsers);
  return updatedUsers.find(user => user.id === userId);
};

// Delete user
export const deleteUser = (userId) => {
  const users = getUsers();
  const filteredUsers = users.filter(user => user.id !== userId);
  saveUsers(filteredUsers);
  return true;
};

// Get user statistics
export const getUserStats = () => {
  const users = getUsers();
  
  const totalHR = users.filter(user => user.role === 'HR').length;
  const totalInterviewers = users.filter(user => user.role === 'Interviewer').length;
  const totalUsers = users.length;

  return {
    totalHR,
    totalInterviewers,
    totalUsers
  };
};

// Initialize with sample data if empty
export const initializeUsers = () => {
  const users = getUsers();
  if (users.length === 0) {
    const initialUsers = [
      {
        id: 1,
        name: 'Rio',
        email: 'rio@gmail.com',
        role: 'HR',
        createdAt: new Date().toISOString(),
        status: 'active'
      },
      {
        id: 2,
        name: 'Nanda',
        email: 'nanda@gmail.com',
        role: 'Interviewer',
        createdAt: new Date().toISOString(),
        status: 'active'
      },
      {
        id: 3,
        name: 'Ashish',
        email: 'ashish@gmail.com',
        role: 'Interviewer',
        createdAt: new Date().toISOString(),
        status: 'active'
      }
    ];
    saveUsers(initialUsers);
  }
};