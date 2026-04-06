import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Platform,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import {
  MessageCircle,
  FileText,
  ChevronRight,
  Info,
} from 'lucide-react-native';

export default function ProfileScreen() {
  const { background, text, textMuted, cardBackground, border, primary } = useTheme();
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleFeedback = () => {
    navigation.navigate('Feedback' as never);
  };

  const handleTerms = () => {
    const url = 'https://trymagically.com/terms';
    if (Platform.OS === 'web') {
      window.open(url, '_blank');
    } else {
      Linking.openURL(url);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: background }} edges={['top']}>
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        {/* Header */}
        <View style={{ padding: 16, paddingBottom: 8 }}>
          <Text style={{ fontSize: 28, fontWeight: '700', color: text }}>Profile</Text>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        >
          {/* App Info Card */}
          <View
            style={{
              backgroundColor: cardBackground,
              borderRadius: 20,
              padding: 24,
              marginBottom: 20,
              borderWidth: 1,
              borderColor: border,
            }}
          >
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: primary + '20',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 12,
                }}
              >
                <Info size={40} color={primary} />
              </View>
              <Text style={{ fontSize: 20, fontWeight: '700', color: text, marginBottom: 4 }}>
                StackPDF
              </Text>
              <Text style={{ fontSize: 14, color: textMuted }}>Free Forever</Text>
            </View>

            {/* App Description */}
            <View
              style={{
                backgroundColor: primary + '10',
                borderRadius: 12,
                padding: 16,
                borderWidth: 1,
                borderColor: primary + '30',
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '600', color: text, marginBottom: 8 }}>
                About StackPDF
              </Text>
              <Text style={{ fontSize: 14, color: textMuted, lineHeight: 20 }}>
                Convert up to 200 photos into professional PDFs. No ads, no subscriptions, completely free.
              </Text>
            </View>
          </View>

          {/* Actions */}
          <View style={{ gap: 12 }}>
            {/* Feedback */}
            <TouchableOpacity
              style={{
                backgroundColor: cardBackground,
                borderRadius: 16,
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderWidth: 1,
                borderColor: border,
              }}
              onPress={handleFeedback}
              activeOpacity={0.7}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: primary + '20',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 12,
                  }}
                >
                  <MessageCircle size={20} color={primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: text, marginBottom: 2 }}>
                    Send Feedback
                  </Text>
                  <Text style={{ fontSize: 14, color: textMuted }}>Help us improve</Text>
                </View>
              </View>
              <ChevronRight size={20} color={textMuted} />
            </TouchableOpacity>

            {/* Terms */}
            <TouchableOpacity
              style={{
                backgroundColor: cardBackground,
                borderRadius: 16,
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderWidth: 1,
                borderColor: border,
              }}
              onPress={handleTerms}
              activeOpacity={0.7}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: primary + '20',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 12,
                  }}
                >
                  <FileText size={20} color={primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: text, marginBottom: 2 }}>
                    Terms of Service
                  </Text>
                  <Text style={{ fontSize: 14, color: textMuted }}>Read our terms</Text>
                </View>
              </View>
              <ChevronRight size={20} color={textMuted} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}
