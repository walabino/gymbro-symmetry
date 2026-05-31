import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from './src/stores/authStore';

// Screens de Autenticación
import { LoginScreen } from './src/screens/LoginScreen';

// Screens Principales
import DashboardScreen from './src/screens/DashboardScreen';
import ProgressCameraScreen from './src/screens/ProgressCameraScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Main Tab Navigator
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap;

        if (route.name === 'Dashboard') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Workouts') {
          iconName = focused ? 'barbell' : 'barbell-outline';
        } else if (route.name === 'Progress') {
          iconName = focused ? 'trending-up' : 'trending-up-outline';
        } else if (route.name === 'Nutrition') {
          iconName = focused ? 'restaurant' : 'restaurant-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        } else {
          iconName = 'help-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#e94560',
      tabBarInactiveTintColor: '#9E9E9E',
      tabBarStyle: {
        backgroundColor: '#1a1a2e',
        borderTopWidth: 0,
        elevation: 0,
        shadowOpacity: 0,
        height: 60,
        paddingBottom: 8,
        paddingTop: 8,
      },
      headerStyle: {
        backgroundColor: '#1a1a2e',
      },
      headerTintColor: '#fff',
    })}
  >
    <Tab.Screen 
      name="Dashboard" 
      component={DashboardScreen}
      options={{ title: 'Inicio' }}
    />
    <Tab.Screen 
      name="Workouts" 
      component={DashboardScreen}
      options={{ title: 'Entrenos' }}
    />
    <Tab.Screen 
      name="Progress" 
      component={ProgressCameraScreen}
      options={{ title: 'Progreso' }}
    />
    <Tab.Screen 
      name="Nutrition" 
      component={DashboardScreen}
      options={{ title: 'Nutrición' }}
    />
    <Tab.Screen 
      name="Profile" 
      component={DashboardScreen}
      options={{ title: 'Perfil' }}
    />
  </Tab.Navigator>
);

export default function App() {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <>
        <StatusBar style="light" />
        {/* Loading screen could be added here */}
      </>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen as any} />
            {/* Add Register, ForgotPassword screens here */}
          </>
        ) : (
          <Stack.Screen name="Main" component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
