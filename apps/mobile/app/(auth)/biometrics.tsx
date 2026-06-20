import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/authStore';
import { T } from '@/constants/i18n';
import { TOUCH_MIN, contentContainer, TS } from '@/constants/Responsive';

export default function BiometricsScreen() {
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);
  const { updateBiometrics } = useAuthStore();

  const handleEnableBiometrics = async () => {
    setIsLoading(true);
    
    if (Platform.OS !== 'web') {
      try {
        // Here we would use expo-local-authentication
      } catch (e) {
        console.log('Biometric error', e);
      }
    }

    // Mock biometric registration success
    await new Promise((r) => setTimeout(r, 1200));
    updateBiometrics(true);
    setIsLoading(false);
    
    // Go to success
    router.replace('/(auth)/success');
  };

  const handleSkip = () => {
    updateBiometrics(false);
    router.replace('/(auth)/success');
  };

  return (
    <LinearGradient colors={['#0A2342', '#143567']} style={styles.gradient}>
      <View style={[styles.container, contentContainer, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}>
        
        {/* Top spacer */}
        <View style={{ height: 40 }} />

        {/* Brand/Security Icon */}
        <View style={styles.iconContainer}>
          <LinearGradient
            colors={['rgba(0,168,168,0.15)', 'rgba(0,168,168,0.05)']}
            style={styles.iconCircleOuter}
          >
            <View style={styles.iconCircleInner}>
              <Ionicons name="finger-print" size={72} color="#00A8A8" />
            </View>
          </LinearGradient>
        </View>

        {/* Text content */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{T.auth.biometrics.title}</Text>
          <Text style={styles.subtitle}>{T.auth.biometrics.subtitle}</Text>
        </View>

        {/* Bullet points */}
        <View style={styles.features}>
          <View style={styles.featureItem}>
            <View style={styles.bullet}>
              <Ionicons name="checkmark-circle" size={20} color="#00A8A8" />
            </View>
            <Text style={styles.featureText}>Log in in 1 second without typing a PIN code</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.bullet}>
              <Ionicons name="checkmark-circle" size={20} color="#00A8A8" />
            </View>
            <Text style={styles.featureText}>Enhanced bank-grade security protection</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.bullet}>
              <Ionicons name="checkmark-circle" size={20} color="#00A8A8" />
            </View>
            <Text style={styles.featureText}>Ultra-simple validation of your transactions</Text>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.btnContainer}>
          <TouchableOpacity
            style={[styles.primaryBtn, { minHeight: TOUCH_MIN }]}
            onPress={handleEnableBiometrics}
            disabled={isLoading}
            activeOpacity={0.85}
            accessibilityLabel={T.auth.biometrics.enable}
          >
            <LinearGradient
              colors={['#00A8A8', '#007575']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.primaryGradient}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Text style={styles.primaryBtnText}>{T.auth.biometrics.enable}</Text>
                  <Ionicons name="lock-open-outline" size={20} color="#FFF" />
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryBtn, { minHeight: TOUCH_MIN, justifyContent: 'center' }]}
            onPress={handleSkip}
            disabled={isLoading}
            activeOpacity={0.85}
            accessibilityLabel={T.auth.biometrics.skip}
          >
            <Text style={styles.secondaryBtnText}>{T.auth.biometrics.skip}</Text>
          </TouchableOpacity>
        </View>

      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1, justifyContent: 'space-between' },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  iconCircleOuter: {
    width: 180,
    height: 180,
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(0,168,168,0.25)',
  },
  iconCircleInner: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(0,168,168,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(0,168,168,0.4)',
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: TS.h1,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 14,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  features: {
    gap: 16,
    marginVertical: 20,
    paddingHorizontal: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bullet: {
    width: 24,
    alignItems: 'center',
  },
  featureText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  btnContainer: {
    gap: 12,
    marginBottom: 20,
  },
  primaryBtn: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  primaryGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 18,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryBtn: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 16,
    fontWeight: '600',
  },
});
