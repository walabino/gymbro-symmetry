import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../stores/authStore';
import { StatCard } from '../components/CommonComponents';
import { progressService, workoutService, nutritionService } from '../config/api';

export const DashboardScreen = ({ navigation }: any) => {
  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    workoutsCompleted: 0,
    photosUploaded: 0,
    caloriesToday: 0,
    currentStreak: 0,
  });

  const loadDashboardData = async () => {
    try {
      // Cargar datos del dashboard
      const [workouts, progress, nutrition] = await Promise.all([
        workoutService.getHistory().catch(() => ({ data: [] })),
        progressService.getPhotos().catch(() => ({ data: [] })),
        nutritionService.getDailyLog().catch(() => ({ data: { totalCalories: 0 } })),
      ]);

      setStats({
        workoutsCompleted: workouts.data?.length || 0,
        photosUploaded: progress.data?.length || 0,
        caloriesToday: nutrition.data?.totalCalories || 0,
        currentStreak: Math.floor(Math.random() * 30), // Mock temporal
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting()},</Text>
          <Text style={styles.userName}>{user?.name || 'Usuario'}</Text>
        </View>
        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Ionicons name="notifications-outline" size={24} color="#fff" />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <StatCard
          title="Entrenamientos"
          value={stats.workoutsCompleted}
          icon="fitness"
          color="#e94560"
          onPress={() => navigation.navigate('Workouts')}
        />
        <StatCard
          title="Fotos Progreso"
          value={stats.photosUploaded}
          icon="camera"
          color="#4CAF50"
          onPress={() => navigation.navigate('Progress')}
        />
        <StatCard
          title="Calorías Hoy"
          value={stats.caloriesToday}
          icon="restaurant"
          color="#FF9800"
          onPress={() => navigation.navigate('Nutrition')}
        />
        <StatCard
          title="Racha Actual"
          value={`${stats.currentStreak} días`}
          icon="flame"
          color="#F44336"
          onPress={() => navigation.navigate('Goals')}
        />
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => navigation.navigate('ProgressCamera')}
          >
            <Ionicons name="camera" size={32} color="#e94560" />
            <Text style={styles.quickActionText}>Tomar Foto</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => navigation.navigate('WorkoutCreator')}
          >
            <Ionicons name="add-circle" size={32} color="#4CAF50" />
            <Text style={styles.quickActionText}>Crear Workout</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => navigation.navigate('MealTracker')}
          >
            <Ionicons name="fast-food" size={32} color="#FF9800" />
            <Text style={styles.quickActionText}>Registrar Comida</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => navigation.navigate('GoalCreator')}
          >
            <Ionicons name="target" size={32} color="#2196F3" />
            <Text style={styles.quickActionText}>Nuevo Objetivo</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actividad Reciente</Text>
        <View style={styles.activityCard}>
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            </View>
            <View style={styles.activityInfo}>
              <Text style={styles.activityTitle}>Entrenamiento completado</Text>
              <Text style={styles.activitySubtitle}>Hace 2 horas • Full Body</Text>
            </View>
          </View>
          <View style={styles.activityDivider} />
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Ionicons name="camera" size={24} color="#e94560" />
            </View>
            <View style={styles.activityInfo}>
              <Text style={styles.activityTitle}>Foto de progreso agregada</Text>
              <Text style={styles.activitySubtitle}>Hace 1 día • Frontal</Text>
            </View>
          </View>
          <View style={styles.activityDivider} />
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Ionicons name="restaurant" size={24} color="#FF9800" />
            </View>
            <View style={styles.activityInfo}>
              <Text style={styles.activityTitle}>Comida registrada</Text>
              <Text style={styles.activitySubtitle}>Hace 3 horas • Almuerzo</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Upcoming */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Próximamente</Text>
        <View style={styles.upcomingCard}>
          <View style={styles.upcomingItem}>
            <View style={styles.upcomingDate}>
              <Text style={styles.upcomingDay}>HOY</Text>
              <Text style={styles.upcomingTime}>18:00</Text>
            </View>
            <View style={styles.upcomingInfo}>
              <Text style={styles.upcomingTitle}>Clase de CrossFit</Text>
              <Text style={styles.upcomingSubtitle}>Coach: María • Cupo: 8/15</Text>
            </View>
            <TouchableOpacity style={styles.joinButton}>
              <Text style={styles.joinButtonText}>Unirse</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#1a1a2e',
  },
  greeting: {
    color: '#9E9E9E',
    fontSize: 16,
  },
  userName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#e94560',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAction: {
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    marginHorizontal: 4,
  },
  quickActionText: {
    color: '#9E9E9E',
    fontSize: 11,
    marginTop: 8,
    textAlign: 'center',
  },
  activityCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIcon: {
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  activitySubtitle: {
    color: '#9E9E9E',
    fontSize: 12,
    marginTop: 2,
  },
  activityDivider: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 12,
  },
  upcomingCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
  },
  upcomingItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  upcomingDate: {
    alignItems: 'center',
    marginRight: 12,
  },
  upcomingDay: {
    color: '#e94560',
    fontSize: 12,
    fontWeight: 'bold',
  },
  upcomingTime: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  upcomingInfo: {
    flex: 1,
  },
  upcomingTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  upcomingSubtitle: {
    color: '#9E9E9E',
    fontSize: 12,
    marginTop: 2,
  },
  joinButton: {
    backgroundColor: '#e94560',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default DashboardScreen;
