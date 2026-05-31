import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { authService, notificationService } from '../config/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'COACH' | 'ALUMNO';
  branchId?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await authService.login(email, password);
      const { token, user } = response.data;
      
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      
      set({ 
        token, 
        user, 
        isAuthenticated: true, 
        isLoading: false 
      });
      
      // Configurar notificaciones push después del login
      await setupPushNotifications();
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Error al iniciar sesión', 
        isLoading: false 
      });
      throw error;
    }
  },

  register: async (data: any) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await authService.register(data);
      const { token, user } = response.data;
      
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      
      set({ 
        token, 
        user, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Error al registrar', 
        isLoading: false 
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      // Llamar al backend para invalidar el token
      if (get().token) {
        await authService.logout().catch(() => {});
      }
    } finally {
      // Limpiar estado local sin importar el resultado
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      
      set({ 
        user: null, 
        token: null, 
        isAuthenticated: false,
        error: null 
      });
    }
  },

  checkAuth: async () => {
    try {
      set({ isLoading: true });
      
      const token = await AsyncStorage.getItem('authToken');
      const userStr = await AsyncStorage.getItem('user');
      
      if (token && userStr) {
        const user = JSON.parse(userStr);
        
        // Verificar si el token sigue siendo válido
        try {
          await notificationService.getNotifications(true);
          
          set({ 
            token, 
            user, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch {
          // Token inválido, limpiar
          await AsyncStorage.removeItem('authToken');
          await AsyncStorage.removeItem('user');
          set({ 
            user: null, 
            token: null, 
            isAuthenticated: false, 
            isLoading: false 
          });
        }
      } else {
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false, 
          isLoading: false 
        });
      }
    } catch (error) {
      set({ 
        user: null, 
        token: null, 
        isAuthenticated: false, 
        isLoading: false 
      });
    }
  },

  clearError: () => set({ error: null }),
}));

// Configuración de Notificaciones Push
async function setupPushNotifications() {
  try {
    const { PermissionsAndroid, Platform } = require('react-native');
    const Notifications = require('expo-notifications').default;
    
    // Solicitar permisos para Android
    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
    }
    
    // Configurar manejo de notificaciones
    Notifications.setNotificationHandler({
      handleNotificationReceivedAsync: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
    
    // Obtener o crear token de push
    const { data: pushToken } = await Notifications.getExpoPushTokenAsync({
      projectId: 'tu-project-id-aqui',
    });
    
    // Enviar token al backend para guardar
    // Esto se implementaría en el backend
    console.log('Push token:', pushToken);
    
  } catch (error) {
    console.error('Error configurando notificaciones:', error);
  }
}

// Hook personalizado para verificar autenticación
export const useAuth = () => {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  return { isAuthenticated, user, isLoading };
};
