import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Interceptor para agregar token JWT automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido - cerrar sesión
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      // Redirigir a login (esto se maneja en el store de auth)
    }
    return Promise.reject(error);
  }
);

// Servicios de Autenticación
export const authService = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  
  register: (data: any) => 
    api.post('/auth/register', data),
  
  forgotPassword: (email: string) => 
    api.post('/auth/forgot-password', { email }),
  
  resetPassword: (token: string, newPassword: string) => 
    api.post(`/auth/reset-password/${token}`, { newPassword }),
  
  logout: () => 
    api.post('/auth/logout'),
};

// Servicios de Progreso
export const progressService = {
  getPhotos: (userId?: string) => 
    api.get('/progress/photos', { params: { userId } }),
  
  uploadPhoto: (formData: FormData) => 
    api.post('/progress/photos', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  deletePhoto: (id: string) => 
    api.delete(`/progress/photos/${id}`),
  
  getMeasurements: (userId?: string) => 
    api.get('/progress/measurements', { params: { userId } }),
  
  saveMeasurements: (data: any) => 
    api.post('/progress/measurements', data),
  
  getStats: (userId?: string) => 
    api.get('/progress/stats', { params: { userId } }),
};

// Servicios de Entrenamientos
export const workoutService = {
  getWorkouts: () => 
    api.get('/workouts'),
  
  getWorkoutById: (id: string) => 
    api.get(`/workouts/${id}`),
  
  createWorkout: (data: any) => 
    api.post('/workouts', data),
  
  updateWorkout: (id: string, data: any) => 
    api.put(`/workouts/${id}`, data),
  
  deleteWorkout: (id: string) => 
    api.delete(`/workouts/${id}`),
  
  getExercises: () => 
    api.get('/workouts/exercises'),
  
  logWorkout: (data: any) => 
    api.post('/workouts/log', data),
  
  getHistory: (userId?: string) => 
    api.get('/workouts/history', { params: { userId } }),
};

// Servicios de Nutrición
export const nutritionService = {
  getDailyLog: (date?: string) => 
    api.get('/nutrition/daily', { params: { date } }),
  
  logMeal: (data: any) => 
    api.post('/nutrition/meals', data),
  
  updateMeal: (id: string, data: any) => 
    api.put(`/nutrition/meals/${id}`, data),
  
  deleteMeal: (id: string) => 
    api.delete(`/nutrition/meals/${id}`),
  
  getWeeklySummary: () => 
    api.get('/nutrition/weekly-summary'),
  
  logWater: (amount: number) => 
    api.post('/nutrition/water', { amount }),
  
  getRecipes: () => 
    api.get('/nutrition/recipes'),
};

// Servicios de Objetivos
export const goalService = {
  getGoals: (status?: string) => 
    api.get('/goals', { params: { status } }),
  
  getGoalById: (id: string) => 
    api.get(`/goals/${id}`),
  
  createGoal: (data: any) => 
    api.post('/goals', data),
  
  updateGoal: (id: string, data: any) => 
    api.put(`/goals/${id}`, data),
  
  deleteGoal: (id: string) => 
    api.delete(`/goals/${id}`),
  
  logProgress: (goalId: string, data: any) => 
    api.post(`/goals/${goalId}/progress`, data),
};

// Servicios de Alumnos/Gestión (GymBro Original)
export const studentService = {
  getStudents: () => 
    api.get('/students'),
  
  getStudentById: (id: string) => 
    api.get(`/students/${id}`),
  
  checkIn: (studentId: string) => 
    api.post(`/students/${studentId}/checkin`),
  
  getAttendance: (studentId: string, startDate?: string, endDate?: string) => 
    api.get(`/students/${studentId}/attendance`, { params: { startDate, endDate } }),
};

// Servicios de Pagos
export const paymentService = {
  getPayments: (userId?: string) => 
    api.get('/payments', { params: { userId } }),
  
  createPayment: (data: any) => 
    api.post('/payments', data),
  
  getSubscription: (userId: string) => 
    api.get(`/subscriptions/user/${userId}`),
  
  renewSubscription: (subscriptionId: string, paymentMethod: string) => 
    api.post(`/subscriptions/${subscriptionId}/renew`, { paymentMethod }),
};

// Servicios de Notificaciones
export const notificationService = {
  getNotifications: (unreadOnly?: boolean) => 
    api.get('/notifications', { params: { unreadOnly } }),
  
  markAsRead: (id: string) => 
    api.put(`/notifications/${id}/read`),
  
  markAllAsRead: () => 
    api.put('/notifications/read-all'),
  
  deleteNotification: (id: string) => 
    api.delete(`/notifications/${id}`),
};

export default api;
