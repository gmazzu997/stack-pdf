import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated, Dimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Image as ImageIcon, Check, ArrowRight, X, Upload } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../contexts/ThemeContext';
import { usePDFStore, ImageItem } from '../stores/pdfStore';
import { MagicallyAlert } from '../components/ui';
import { Image } from 'expo-image';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const imageSize = isWeb ? 120 : (width - 48 - 24) / 3; // Responsive sizing

export default function PhotoSelectionScreen() {
  const { background, text, textMuted, primary, cardBackground, border } = useTheme();
  const navigation = useNavigation();
  const { selectedImages, setSelectedImages } = usePDFStore();
  const [localSelectedImages, setLocalSelectedImages] = useState<ImageItem[]>(selectedImages);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    if (!isWeb) {
      requestPermissions();
    }
  }, []);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      MagicallyAlert.alert('Permission Required', 'Please grant photo library access to select images');
    }
  };

  const handleWebFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImages: ImageItem[] = Array.from(files).map((file, idx) => {
      const url = URL.createObjectURL(file);
      return {
        uri: url,
        name: file.name,
        width: 0, // Will be determined when loaded
        height: 0, // Will be determined when loaded
        fileSize: file.size,
      };
    });

    const updatedImages = [...localSelectedImages, ...newImages];
    
    if (updatedImages.length > 200) {
      MagicallyAlert.alert('Limit Exceeded', 'You can only select up to 200 images');
      return;
    }

    setLocalSelectedImages(updatedImages);
  };

  const pickImages = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: 200 - localSelectedImages.length,
      });

      if (!result.canceled && result.assets) {
        const newImages: ImageItem[] = result.assets.map((asset, idx) => {
          // Extract filename from URI if fileName not provided (common on Android)
          let filename = asset.fileName;
          console.log(`[PhotoPicker] Asset ${idx}:`, {
            fileName: asset.fileName,
            uri: asset.uri,
          });
          
          if (!filename && asset.uri) {
            const uriParts = asset.uri.split('/');
            filename = uriParts[uriParts.length - 1];
            console.log(`[PhotoPicker] Extracted from URI:`, filename);
          }
          if (!filename) {
            filename = `Image-${Date.now()}.jpg`;
          }
          
          console.log(`[PhotoPicker] Final filename:`, filename);
          
          return {
            uri: asset.uri,
            name: filename,
            width: asset.width,
            height: asset.height,
            fileSize: asset.fileSize,
          };
        });

        const updatedImages = [...localSelectedImages, ...newImages];
        
        if (updatedImages.length > 200) {
          MagicallyAlert.alert('Limit Reached', 'You can select up to 200 images maximum');
          setLocalSelectedImages(updatedImages.slice(0, 200));
        } else {
          setLocalSelectedImages(updatedImages);
        }
      }
    } catch (error) {
      console.error('Image picker error:', error);
      MagicallyAlert.alert('Error', 'Failed to select images');
    }
  };

  const removeImage = (index: number) => {
    setLocalSelectedImages(localSelectedImages.filter((_, i) => i !== index));
  };

  const handleContinue = () => {
    if (localSelectedImages.length === 0) {
      MagicallyAlert.alert('No Images', 'Please select at least one image');
      return;
    }

    setSelectedImages(localSelectedImages);
    navigation.navigate('ReorderScreen' as never);
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: background }}>
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <View style={{ padding: 24, paddingBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ fontSize: 28, fontWeight: '700', color: text }}>
              Select Photos
            </Text>
            <TouchableOpacity onPress={handleCancel} style={{ padding: 8 }}>
              <X size={24} color={textMuted} />
            </TouchableOpacity>
          </View>
          <Text style={{ fontSize: 14, color: textMuted, marginBottom: 20 }}>
            Choose up to 200 images • {localSelectedImages.length} selected
          </Text>

          <View style={{ flexDirection: 'row', gap: 12 }}>
            {isWeb ? (
              <View style={{ flex: 1 }}>
                <input
                  ref={(input) => {
                    if (input) {
                      input.style.display = 'none';
                      (window as any).fileInput = input;
                    }
                  }}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleWebFileUpload}
                  disabled={localSelectedImages.length >= 200}
                />
                <TouchableOpacity
                  onPress={() => {
                    const input = (window as any).fileInput;
                    if (input) input.click();
                  }}
                  disabled={localSelectedImages.length >= 200}
                  activeOpacity={0.7}
                  style={{
                    flex: 1,
                    backgroundColor: cardBackground,
                    borderRadius: 14,
                    padding: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    borderWidth: 1,
                    borderColor: localSelectedImages.length >= 200 ? border : primary,
                    opacity: localSelectedImages.length >= 200 ? 0.5 : 1,
                  }}
                >
                  <Upload size={20} color={localSelectedImages.length >= 200 ? textMuted : primary} />
                  <Text style={{ 
                    fontSize: 16, 
                    fontWeight: '600', 
                    color: localSelectedImages.length >= 200 ? textMuted : primary 
                  }}>
                    Upload Photos
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={pickImages}
                disabled={localSelectedImages.length >= 200}
                activeOpacity={0.7}
                style={{
                  flex: 1,
                  backgroundColor: cardBackground,
                  borderRadius: 14,
                  padding: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  borderWidth: 1,
                  borderColor: localSelectedImages.length >= 200 ? border : primary,
                  opacity: localSelectedImages.length >= 200 ? 0.5 : 1,
                }}
              >
                <ImageIcon size={20} color={localSelectedImages.length >= 200 ? textMuted : primary} />
                <Text style={{ 
                  fontSize: 16, 
                  fontWeight: '600', 
                  color: localSelectedImages.length >= 200 ? textMuted : primary 
                }}>
                  Select Photos
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={handleContinue}
              disabled={localSelectedImages.length === 0}
              activeOpacity={0.7}
              style={{
                flex: 1,
                backgroundColor: localSelectedImages.length > 0 ? primary : cardBackground,
                borderRadius: 14,
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                borderWidth: 1,
                borderColor: localSelectedImages.length > 0 ? primary : border,
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '600',
                  color: localSelectedImages.length > 0 ? '#fff' : textMuted,
                }}
              >
                Continue
              </Text>
              <ArrowRight size={20} color={localSelectedImages.length > 0 ? '#fff' : textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 24, paddingTop: 8 }}
          showsVerticalScrollIndicator={false}
        >
          {localSelectedImages.length === 0 ? (
            <View
              style={{
                backgroundColor: cardBackground,
                borderRadius: 20,
                padding: 40,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: border,
                marginTop: 40,
              }}
            >
              <View
                style={{
                  width: 80,
                  height: 80,
                  backgroundColor: background,
                  borderRadius: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                }}
              >
                <ImageIcon size={40} color={textMuted} />
              </View>
              <Text style={{ fontSize: 16, fontWeight: '600', color: text, marginBottom: 8 }}>
                No photos selected
              </Text>
              <Text style={{ fontSize: 14, color: textMuted, textAlign: 'center' }}>
                Tap "Add Photos" to select images from your gallery
              </Text>
            </View>
          ) : (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
              {localSelectedImages.map((image, index) => (
                <View
                  key={`${image.uri}-${index}`}
                  style={{
                    width: imageSize,
                    height: imageSize,
                    borderRadius: 12,
                    overflow: 'hidden',
                    backgroundColor: cardBackground,
                    borderWidth: 1,
                    borderColor: border,
                    position: 'relative',
                  }}
                >
                  <Image source={{ uri: image.uri }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
                  
                  <View
                    style={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      backgroundColor: primary,
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 12, fontWeight: '700', color: '#fff' }}>
                      {index + 1}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => removeImage(index)}
                    style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      width: 28,
                      height: 28,
                      borderRadius: 14,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <X size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}
