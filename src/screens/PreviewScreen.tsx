import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Download, ArrowLeft, Loader2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';
import { usePDFStore } from '../stores/pdfStore';
import { pdfService } from '../services/pdfService';
import { MagicallyAlert, AnimatedSpinner } from '../components/ui';
import { Image } from 'expo-image';

const { width } = Dimensions.get('window');

type PreviewScreenParams = {
  Preview: {
    pdfName: string;
  };
};

export default function PreviewScreen() {
  const { background, text, textMuted, primary, primaryLight, cardBackground, border } = useTheme();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<PreviewScreenParams, 'Preview'>>();
  const { selectedImages, isGenerating, generationProgress, generationStatus, setGenerating, setGenerationProgress, setGenerationStatus, clearImages } = usePDFStore();
  const [pdfName] = useState(route.params?.pdfName || `PDF-${Date.now()}`);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: generationProgress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [generationProgress]);

  const handleGeneratePDF = async () => {
    setGenerating(true);
    setGenerationProgress(0);
    setGenerationStatus('Starting...');

    try {
      const pdfUrl = await pdfService.generatePDF(
        selectedImages,
        pdfName,
        (progress, status) => {
          setGenerationProgress(progress);
          setGenerationStatus(status);
        }
      );

      setGenerating(false);

      MagicallyAlert.alert(
        'Success!',
        'Your PDF has been generated successfully',
        [
          {
            text: 'View PDF',
            onPress: () => {
              pdfService.downloadAndSharePDF(pdfUrl, pdfName);
            },
          },
          {
            text: 'Done',
            onPress: () => {
              clearImages();
              navigation.navigate('Photos' as never);
            },
          },
        ]
      );
    } catch (error: any) {
      setGenerating(false);
      MagicallyAlert.alert('Error', error.message || 'Failed to generate PDF');
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: background }}>
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <View style={{ padding: 24, paddingBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            <TouchableOpacity onPress={handleBack} disabled={isGenerating} style={{ padding: 8, marginLeft: -8, marginRight: 8 }}>
              <ArrowLeft size={24} color={isGenerating ? textMuted : text} />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 28, fontWeight: '700', color: text }}>
                Preview
              </Text>
              <Text style={{ fontSize: 14, color: textMuted, marginTop: 2 }}>
                {pdfName}
              </Text>
            </View>
          </View>

          {isGenerating ? (
            <View
              style={{
                backgroundColor: cardBackground,
                borderRadius: 20,
                padding: 24,
                borderWidth: 1,
                borderColor: border,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <View
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 14,
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                >
                  <LinearGradient
                    colors={[primary, primaryLight]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      width: '100%',
                      height: '100%',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <AnimatedSpinner size={24} color="#fff" />
                  </LinearGradient>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 18, fontWeight: '600', color: text, marginBottom: 4 }}>
                    Generating PDF
                  </Text>
                  <Text style={{ fontSize: 14, color: textMuted }}>
                    {generationStatus}
                  </Text>
                </View>
              </View>

              <View style={{ marginBottom: 12 }}>
                <View
                  style={{
                    height: 10,
                    backgroundColor: background,
                    borderRadius: 6,
                    overflow: 'hidden',
                  }}
                >
                  <Animated.View style={{ width: progressWidth, height: '100%', overflow: 'hidden', borderRadius: 6 }}>
                    <LinearGradient
                      colors={[primary, primaryLight]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{ width: '100%', height: '100%' }}
                    />
                  </Animated.View>
                </View>
              </View>

              <Text style={{ fontSize: 20, fontWeight: '700', color: text, textAlign: 'center' }}>
                {Math.round(generationProgress)}%
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              onPress={handleGeneratePDF}
              activeOpacity={0.8}
              style={{
                overflow: 'hidden',
                borderRadius: 16,
              }}
            >
                <LinearGradient
                  colors={[primary, primaryLight]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    paddingVertical: 18,
                    paddingHorizontal: 24,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  <Download size={20} color="#fff" />
                  <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff' }}>
                    Generate PDF
                  </Text>
                  </LinearGradient>
                  </TouchableOpacity>
                  )}
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 24, paddingTop: 8 }}
          showsVerticalScrollIndicator={false}
        >
          <Text style={{ fontSize: 14, fontWeight: '600', color: textMuted, marginBottom: 12 }}>
            PDF LAYOUT PREVIEW ({selectedImages.length} pages)
          </Text>

          {selectedImages.map((image, index) => (
            <View
              key={`${image.uri}-${index}`}
              style={{
                marginBottom: 16,
                backgroundColor: cardBackground,
                borderRadius: 16,
                overflow: 'hidden',
                borderWidth: 1,
                borderColor: border,
              }}
            >
              <View
                style={{
                  backgroundColor: background,
                  padding: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Text style={{ fontSize: 13, fontWeight: '600', color: text }}>
                  Page {index + 1}
                </Text>
                <Text style={{ fontSize: 12, color: textMuted }} numberOfLines={1}>
                  {image.name}
                </Text>
              </View>
              
              <View style={{ aspectRatio: image.width && image.height ? image.width / image.height : 3 / 4 }}>
                <Image
                  source={{ uri: image.uri }}
                  style={{ width: '100%', height: '100%' }}
                  contentFit="cover"
                />
              </View>
            </View>
          ))}
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}
