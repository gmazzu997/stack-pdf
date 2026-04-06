import React from 'react';
import { View, Text, Animated, TouchableOpacity, Easing, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { FileText, GripVertical, X, Download, ChevronRight, CheckCircle2, Loader2 } from 'lucide-react-native';

const COLORS = {
  background: '#0f0f0f',
  surface: '#1a1a1a',
  surfaceLight: '#242424',
  primary: '#3b82f6',
  primaryLight: '#60a5fa',
  text: '#ffffff',
  textSecondary: '#a8a8a8',
  border: '#2a2a2a',
  success: '#10b981',
  accent: '#8b5cf6',
};

const MOCK_PHOTOS = [
  { id: '1', uri: 'https://trymagically.com/api/media/image?query=modern%20architecture%20building', name: 'Architecture-001.jpg' },
  { id: '2', uri: 'https://trymagically.com/api/media/image?query=business%20documents%20on%20desk', name: 'Document-002.jpg' },
  { id: '3', uri: 'https://trymagically.com/api/media/image?query=city%20skyline%20at%20sunset', name: 'Skyline-003.jpg' },
  { id: '4', uri: 'https://trymagically.com/api/media/image?query=minimalist%20workspace', name: 'Workspace-004.jpg' },
];

const MOCK_PDF_STATUS = {
  total: 47,
  processed: 32,
  percentage: 68,
  estimatedTime: '12s',
};

export const Reference = () => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.9)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ padding: 24, paddingTop: 60 }}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <Text style={{ fontSize: 32, fontWeight: '700', color: COLORS.text, marginBottom: 8 }}>
            Photo Stack
          </Text>
          <Text style={{ fontSize: 16, color: COLORS.textSecondary, marginBottom: 32 }}>
            4 photos ready to convert
          </Text>
        </Animated.View>

        <PhotoStackPreview photos={MOCK_PHOTOS} fadeAnim={fadeAnim} scaleAnim={scaleAnim} />

        <View style={{ height: 32 }} />

        <PDFGenerationCard status={MOCK_PDF_STATUS} fadeAnim={fadeAnim} />
      </View>
    </ScrollView>
  );
};

const PhotoStackPreview = ({ photos, fadeAnim, scaleAnim }) => {
  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }],
      }}
    >
      <View
        style={{
          backgroundColor: COLORS.surface,
          borderRadius: 24,
          padding: 20,
          borderWidth: 1,
          borderColor: COLORS.border,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View
              style={{
                width: 48,
                height: 48,
                backgroundColor: COLORS.surfaceLight,
                borderRadius: 14,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FileText size={24} color={COLORS.primary} />
            </View>
            <View>
              <Text style={{ fontSize: 18, fontWeight: '600', color: COLORS.text }}>Selected Photos</Text>
              <Text style={{ fontSize: 14, color: COLORS.textSecondary, marginTop: 2 }}>
                {photos.length} items • Drag to reorder
              </Text>
            </View>
          </View>
        </View>

        {photos.map((photo, index) => (
          <PhotoCard key={photo.id} photo={photo} index={index} />
        ))}

        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            marginTop: 16,
            overflow: 'hidden',
            borderRadius: 16,
          }}
        >
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryLight]}
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
            <Download size={20} color={COLORS.text} />
            <Text style={{ fontSize: 16, fontWeight: '600', color: COLORS.text }}>Generate PDF</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const PhotoCard = ({ photo, index }) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const slideAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 600,
      delay: index * 100,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: true,
    }).start();
  }, [index]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={{
        opacity: slideAnim,
        transform: [
          { scale: scaleAnim },
          {
            translateX: slideAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            }),
          },
        ],
        marginBottom: 12,
      }}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{
          backgroundColor: COLORS.surfaceLight,
          borderRadius: 16,
          padding: 14,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 14,
          borderWidth: 1,
          borderColor: COLORS.border,
        }}
      >
        <View
          style={{
            width: 28,
            height: 28,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <GripVertical size={20} color={COLORS.textSecondary} />
        </View>

        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 12,
            overflow: 'hidden',
            backgroundColor: COLORS.surface,
          }}
        >
          <Image source={{ uri: photo.uri }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 15, fontWeight: '600', color: COLORS.text, marginBottom: 4 }} numberOfLines={1}>
            {photo.name}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View
              style={{
                backgroundColor: COLORS.surface,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 6,
              }}
            >
              <Text style={{ fontSize: 12, color: COLORS.textSecondary }}>Page {index + 1}</Text>
            </View>
            <ChevronRight size={14} color={COLORS.textSecondary} />
          </View>
        </View>

        <TouchableOpacity
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            backgroundColor: COLORS.surface,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={18} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

const PDFGenerationCard = ({ status, fadeAnim }) => {
  const progressAnim = React.useRef(new Animated.Value(0)).current;
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const rotateAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: status.percentage,
      duration: 1500,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: false,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          easing: Easing.sin,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.sin,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <View
        style={{
          backgroundColor: COLORS.surface,
          borderRadius: 24,
          padding: 24,
          borderWidth: 1,
          borderColor: COLORS.border,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <Animated.View
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              transform: [{ scale: pulseAnim }],
            }}
          >
            <LinearGradient
              colors={[COLORS.primary, COLORS.accent]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Animated.View style={{ transform: [{ rotate: spin }] }}>
                <Loader2 size={28} color={COLORS.text} />
              </Animated.View>
            </LinearGradient>
          </Animated.View>

          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 20, fontWeight: '600', color: COLORS.text, marginBottom: 4 }}>
              Generating PDF
            </Text>
            <Text style={{ fontSize: 14, color: COLORS.textSecondary }}>
              {status.processed} of {status.total} images processed
            </Text>
          </View>
        </View>

        <View style={{ marginBottom: 16 }}>
          <View
            style={{
              height: 12,
              backgroundColor: COLORS.surfaceLight,
              borderRadius: 8,
              overflow: 'hidden',
            }}
          >
            <Animated.View style={{ width: progressWidth, height: '100%', overflow: 'hidden', borderRadius: 8 }}>
              <LinearGradient
                colors={[COLORS.primary, COLORS.primaryLight]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ width: '100%', height: '100%' }}
              />
            </Animated.View>
          </View>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 24, fontWeight: '700', color: COLORS.text }}>{status.percentage}%</Text>
          <View
            style={{
              backgroundColor: COLORS.surfaceLight,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 8,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: COLORS.success,
              }}
            />
            <Text style={{ fontSize: 13, color: COLORS.textSecondary }}>~{status.estimatedTime} remaining</Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};