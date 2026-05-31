import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress?: () => void;
}

export const StatCard = ({ title, value, icon, color, onPress }: StatCardProps) => (
  <TouchableOpacity 
    style={styles.card} 
    onPress={onPress}
    activeOpacity={0.7}
  >
    <LinearGradient
      colors={[color, `${color}88`]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={28} color="#fff" />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
    </LinearGradient>
  </TouchableOpacity>
);

interface ProgressPhotoCardProps {
  uri: string;
  date: string;
  type: 'front' | 'side' | 'back';
  onDelete?: () => void;
}

export const ProgressPhotoCard = ({ uri, date, type, onDelete }: ProgressPhotoCardProps) => (
  <View style={styles.photoCard}>
    <Image source={{ uri }} style={styles.photo} />
    <View style={styles.photoInfo}>
      <Text style={styles.photoType}>{type.toUpperCase()}</Text>
      <Text style={styles.photoDate}>{date}</Text>
    </View>
    {onDelete && (
      <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
        <Ionicons name="trash-outline" size={20} color="#ff4444" />
      </TouchableOpacity>
    )}
  </View>
);

interface WorkoutItemProps {
  name: string;
  duration: number;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  exercises: number;
  completed?: boolean;
  onPress?: () => void;
}

export const WorkoutItem = ({ 
  name, 
  duration, 
  difficulty, 
  exercises, 
  completed,
  onPress 
}: WorkoutItemProps) => {
  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'BEGINNER': return '#4CAF50';
      case 'INTERMEDIATE': return '#FF9800';
      case 'ADVANCED': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.workoutItem, completed && styles.workoutCompleted]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.workoutLeft}>
        <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor() }]}>
          <Text style={styles.difficultyText}>{difficulty}</Text>
        </View>
        <View style={styles.workoutInfo}>
          <Text style={styles.workoutName}>{name}</Text>
          <Text style={styles.workoutDetails}>
            {exercises} ejercicios • {duration} min
          </Text>
        </View>
      </View>
      {completed && (
        <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
      )}
    </TouchableOpacity>
  );
};

interface MealItemProps {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
  onEdit?: () => void;
}

export const MealItem = ({ 
  name, 
  calories, 
  protein, 
  carbs, 
  fat, 
  time,
  onEdit 
}: MealItemProps) => (
  <View style={styles.mealItem}>
    <View style={styles.mealHeader}>
      <Text style={styles.mealName}>{name}</Text>
      <Text style={styles.mealTime}>{time}</Text>
    </View>
    <View style={styles.mealMacros}>
      <View style={styles.macroItem}>
        <Text style={styles.macroValue}>{calories}</Text>
        <Text style={styles.macroLabel}>CAL</Text>
      </View>
      <View style={styles.macroItem}>
        <Text style={styles.macroValue}>{protein}g</Text>
        <Text style={styles.macroLabel}>PRO</Text>
      </View>
      <View style={styles.macroItem}>
        <Text style={styles.macroValue}>{carbs}g</Text>
        <Text style={styles.macroLabel}>CARB</Text>
      </View>
      <View style={styles.macroItem}>
        <Text style={styles.macroValue}>{fat}g</Text>
        <Text style={styles.macroLabel}>FAT</Text>
      </View>
    </View>
    {onEdit && (
      <TouchableOpacity style={styles.editButton} onPress={onEdit}>
        <Ionicons name="create-outline" size={18} color="#2196F3" />
      </TouchableOpacity>
    )}
  </View>
);

interface GoalCardProps {
  title: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  deadline: string;
  progress: number;
  onPress?: () => void;
}

export const GoalCard = ({ 
  title, 
  currentValue, 
  targetValue, 
  unit, 
  deadline,
  progress,
  onPress 
}: GoalCardProps) => (
  <TouchableOpacity 
    style={styles.goalCard} 
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.goalHeader}>
      <Text style={styles.goalTitle}>{title}</Text>
      <Text style={styles.goalDeadline}>{deadline}</Text>
    </View>
    <View style={styles.goalProgress}>
      <View style={styles.progressBackground}>
        <View 
          style={[styles.progressBar, { width: `${Math.min(progress, 100)}%` }]} 
        />
      </View>
      <Text style={styles.progressText}>{Math.round(progress)}%</Text>
    </View>
    <View style={styles.goalValues}>
      <Text style={styles.currentValue}>{currentValue}{unit}</Text>
      <Ionicons name="arrow-forward" size={16} color="#9E9E9E" />
      <Text style={styles.targetValue}>{targetValue}{unit}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    margin: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gradient: {
    padding: 20,
    minHeight: 120,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  value: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  title: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
  },
  photoCard: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    margin: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  photo: {
    width: '100%',
    height: 200,
  },
  photoInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 12,
  },
  photoType: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  photoDate: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.8,
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 6,
  },
  workoutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 8,
  },
  workoutCompleted: {
    opacity: 0.6,
  },
  workoutLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 12,
  },
  difficultyText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  workoutInfo: {
    flex: 1,
  },
  workoutName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  workoutDetails: {
    color: '#9E9E9E',
    fontSize: 13,
  },
  mealItem: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 8,
    position: 'relative',
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mealName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  mealTime: {
    color: '#9E9E9E',
    fontSize: 12,
  },
  mealMacros: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  macroItem: {
    alignItems: 'center',
  },
  macroValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  macroLabel: {
    color: '#9E9E9E',
    fontSize: 10,
    marginTop: 2,
  },
  editButton: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  goalCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 8,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  goalDeadline: {
    color: '#9E9E9E',
    fontSize: 12,
  },
  goalProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 12,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: 'bold',
    width: 40,
    textAlign: 'right',
  },
  goalValues: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  currentValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  targetValue: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
