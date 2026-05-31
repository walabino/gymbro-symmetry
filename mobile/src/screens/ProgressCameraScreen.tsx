import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import { progressService } from '../config/api';

export const ProgressCameraScreen = ({ navigation }: any) => {
  const [selectedType, setSelectedType] = useState<'front' | 'side' | 'back' | 'face'>('front');
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [photos, setPhotos] = useState<any[]>([]);

  const requestPermissions = async () => {
    const cameraPermission = await Camera.requestCameraPermissionsAsync();
    const mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (cameraPermission.status !== 'granted' || mediaPermission.status !== 'granted') {
      Alert.alert('Permisos requeridos', 'Necesitamos acceso a la cámara y galería para tomar fotos de progreso.');
      return false;
    }
    return true;
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
        cameraType: selectedType === 'face' ? 'front' : 'back',
      });

      if (!result.canceled && result.assets[0]) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo tomar la foto');
    }
  };

  const pickFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  const uploadPhoto = async () => {
    if (!image) {
      Alert.alert('Error', 'Primero debes tomar o seleccionar una foto');
      return;
    }

    try {
      setUploading(true);

      // Crear FormData para subir la imagen
      const formData = new FormData();
      formData.append('photo', {
        uri: image,
        type: 'image/jpeg',
        name: `progress_${selectedType}_${Date.now()}.jpg`,
      } as any);
      formData.append('type', selectedType);
      formData.append('notes', `Foto de progreso ${selectedType}`);

      const response = await progressService.uploadPhoto(formData);
      
      Alert.alert('Éxito', 'Foto de progreso subida correctamente');
      setImage(null);
      loadPhotos();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'No se pudo subir la foto');
    } finally {
      setUploading(false);
    }
  };

  const loadPhotos = async () => {
    try {
      const response = await progressService.getPhotos();
      setPhotos(response.data || []);
    } catch (error) {
      console.error('Error loading photos:', error);
    }
  };

  React.useEffect(() => {
    loadPhotos();
  }, []);

  const photoTypes = [
    { type: 'front' as const, label: 'Frontal', icon: 'person-front-outline' },
    { type: 'side' as const, label: 'Lateral', icon: 'person-outline' },
    { type: 'back' as const, label: 'Espalda', icon: 'person-back-outline' },
    { type: 'face' as const, label: 'Rostro', icon: 'happy-outline' },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Selector de tipo de foto */}
      <View style={styles.typeSelector}>
        <Text style={styles.sectionTitle}>Tipo de Foto</Text>
        <View style={styles.typeButtons}>
          {photoTypes.map((item) => (
            <TouchableOpacity
              key={item.type}
              style={[
                styles.typeButton,
                selectedType === item.type && styles.typeButtonActive,
              ]}
              onPress={() => setSelectedType(item.type)}
            >
              <Ionicons
                name={item.icon}
                size={24}
                color={selectedType === item.type ? '#fff' : '#9E9E9E'}
              />
              <Text
                style={[
                  styles.typeButtonText,
                  selectedType === item.type && styles.typeButtonTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Vista previa de imagen */}
      {image && (
        <View style={styles.previewContainer}>
          <Image source={{ uri: image }} style={styles.preview} />
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => setImage(null)}
          >
            <Ionicons name="close-circle" size={32} color="#ff4444" />
          </TouchableOpacity>
        </View>
      )}

      {/* Botones de acción */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton} onPress={takePhoto}>
          <Ionicons name="camera" size={32} color="#fff" />
          <Text style={styles.actionButtonText}>Tomar Foto</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={pickFromGallery}>
          <Ionicons name="images" size={32} color="#fff" />
          <Text style={styles.actionButtonText}>Galería</Text>
        </TouchableOpacity>
      </View>

      {/* Botón de subir */}
      {image && (
        <TouchableOpacity
          style={[styles.uploadButton, uploading && styles.uploadButtonDisabled]}
          onPress={uploadPhoto}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="cloud-upload" size={24} color="#fff" />
              <Text style={styles.uploadButtonText}>Subir Foto de Progreso</Text>
            </>
          )}
        </TouchableOpacity>
      )}

      {/* Galería de fotos anteriores */}
      <View style={styles.gallerySection}>
        <Text style={styles.sectionTitle}>Fotos Anteriores</Text>
        <View style={styles.galleryGrid}>
          {photos.slice(0, 6).map((photo, index) => (
            <View key={index} style={styles.galleryItem}>
              <Image source={{ uri: photo.url }} style={styles.galleryImage} />
              <View style={styles.galleryInfo}>
                <Text style={styles.galleryType}>{photo.type}</Text>
                <Text style={styles.galleryDate}>
                  {new Date(photo.date).toLocaleDateString()}
                </Text>
              </View>
            </View>
          ))}
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
    padding: 20,
    paddingTop: 60,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  typeSelector: {
    marginBottom: 24,
  },
  typeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typeButton: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#1E1E1E',
    flex: 1,
    marginHorizontal: 4,
  },
  typeButtonActive: {
    backgroundColor: '#e94560',
  },
  typeButtonText: {
    color: '#9E9E9E',
    fontSize: 11,
    marginTop: 6,
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  previewContainer: {
    position: 'relative',
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
  preview: {
    width: '100%',
    height: 400,
    resizeMode: 'cover',
  },
  removeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 20,
    width: '45%',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 8,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  uploadButtonDisabled: {
    opacity: 0.6,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  gallerySection: {
    marginTop: 20,
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  galleryItem: {
    width: '48%',
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#1E1E1E',
  },
  galleryImage: {
    width: '100%',
    height: 150,
  },
  galleryInfo: {
    padding: 10,
  },
  galleryType: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  galleryDate: {
    color: '#9E9E9E',
    fontSize: 10,
    marginTop: 2,
  },
});

export default ProgressCameraScreen;
