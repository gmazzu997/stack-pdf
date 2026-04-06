import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated, Platform, KeyboardAvoidingView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, ArrowUpAZ, FileText, X, GripVertical, ChevronsDown, Eye } from 'lucide-react-native';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';
import { useTheme } from '../contexts/ThemeContext';
import { usePDFStore } from '../stores/pdfStore';
import { MagicallyAlert } from '../components/ui';
import { Image } from 'expo-image';

export default function ReorderScreen() {
  const { background, text, textMuted, primary, cardBackground, border, inputBackground } = useTheme();
  const navigation = useNavigation();
  const pdfStore = usePDFStore();
  const { selectedImages, reorderImages, setSelectedImages, sortImagesAlphabetically } = pdfStore;
  const [pdfName, setPdfName] = useState(`PDF-${new Date().toLocaleDateString()}`);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    if (selectedImages.length === 0) {
      navigation.goBack();
    }
  }, [selectedImages]);

  const handleRemove = (index: number) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);
    pdfStore.setSelectedImages(newImages);

    if (newImages.length === 0) {
      navigation.goBack();
    }
  };

  const handleSendToEnd = (index: number) => {
    const newImages = [...selectedImages];
    const [movedImage] = newImages.splice(index, 1);
    newImages.push(movedImage);
    setSelectedImages(newImages);
    pdfStore.setSelectedImages(newImages);
  };

  const handleSort = () => {
    sortImagesAlphabetically();
    MagicallyAlert.alert('Sorted', 'Images sorted alphabetically by name');
  };

  const handlePreview = () => {
    if (!pdfName.trim()) {
      MagicallyAlert.alert('Name Required', 'Please enter a name for your PDF');
      return;
    }
    navigation.navigate('PreviewScreen' as never, { pdfName: pdfName.trim() } as never);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const onGestureEvent = (index: number) => (event: any) => {
    const { translationY, state } = event.nativeEvent;
    
    if (state === State.ACTIVE) {
      setDraggingIndex(index);
      
      // Calculate new position based on drag
      const itemHeight = 88; // Card height (64px image + 24px padding)
      const newIndex = Math.max(0, Math.min(selectedImages.length - 1, index + Math.round(translationY / itemHeight)));
      
      if (newIndex !== index) {
        reorderImages(index, newIndex);
      }
    } else if (state === State.END || state === State.CANCELLED) {
      setDraggingIndex(null);
    }
  };

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={{ flex: 1, backgroundColor: background }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
            <View style={{ padding: 24, paddingBottom: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                <TouchableOpacity onPress={handleBack} style={{ padding: 8, marginLeft: -8, marginRight: 8 }}>
                  <ArrowLeft size={24} color={text} />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 28, fontWeight: '700', color: text }}>
                    Reorder Photos
                  </Text>
                  <Text style={{ fontSize: 14, color: textMuted, marginTop: 2 }}>
                    {selectedImages.length} {selectedImages.length === 1 ? 'image' : 'images'}
                  </Text>
                </View>
              </View>

              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: text, marginBottom: 8 }}>
                  PDF Name
                </Text>
                <TextInput
                  value={pdfName}
                  onChangeText={setPdfName}
                  placeholder="Enter PDF name"
                  placeholderTextColor={textMuted}
                  style={{
                    backgroundColor: inputBackground,
                    borderRadius: 12,
                    padding: 14,
                    fontSize: 15,
                    color: text,
                    borderWidth: 1,
                    borderColor: border,
                  }}
                />
              </View>

              <View style={{ flexDirection: 'row', gap: 12 }}>
                <TouchableOpacity
                  onPress={handleSort}
                  activeOpacity={0.7}
                  style={{
                    backgroundColor: cardBackground,
                    borderRadius: 14,
                    padding: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    borderWidth: 1,
                    borderColor: border,
                    flex: 0.4,
                  }}
                >
                  <ArrowUpAZ size={20} color={primary} />
                  <Text style={{ fontSize: 16, fontWeight: '600', color: text }}>
                    Sort A-Z
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handlePreview}
                  activeOpacity={0.7}
                  style={{
                    backgroundColor: primary,
                    borderRadius: 14,
                    padding: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    flex: 0.6,
                  }}
                >
                  <Eye size={20} color="#fff" />
                  <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff' }}>
                    Preview PDF
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ padding: 24, paddingTop: 8 }}
              showsVerticalScrollIndicator={false}
            >
              {selectedImages.map((image, index) => (
                <Animated.View
                  key={`${image.uri}-${index}`}
                  style={{
                    opacity: draggingIndex === index ? 0.5 : 1,
                    marginBottom: 12,
                    transform: [{ scale: draggingIndex === index ? 1.02 : 1 }],
                  }}
                >
                  <View
                    style={{
                      backgroundColor: cardBackground,
                      borderRadius: 16,
                      padding: 14,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 14,
                      borderWidth: 1,
                      borderColor: draggingIndex === index ? primary : border,
                    }}
                  >
                    <PanGestureHandler
                      onGestureEvent={onGestureEvent(index)}
                      onHandlerStateChange={onGestureEvent(index)}
                    >
                      <View
                        style={{
                          width: 28,
                          height: 28,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <GripVertical size={20} color={draggingIndex === index ? primary : textMuted} />
                      </View>
                    </PanGestureHandler>

                    <View
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: 12,
                        overflow: 'hidden',
                        backgroundColor: background,
                      }}
                    >
                      <Image source={{ uri: image.uri }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 15, fontWeight: '600', color: text, marginBottom: 4 }} numberOfLines={1}>
                        {image.name}
                      </Text>
                      <View
                        style={{
                          backgroundColor: background,
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                          borderRadius: 6,
                          alignSelf: 'flex-start',
                        }}
                      >
                        <Text style={{ fontSize: 12, color: textMuted }}>Page {index + 1}</Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      onPress={() => handleSendToEnd(index)}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        backgroundColor: background,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <ChevronsDown size={18} color={textMuted} />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleRemove(index)}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        backgroundColor: background,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <X size={18} color={textMuted} />
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              ))}
            </ScrollView>
          </Animated.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}