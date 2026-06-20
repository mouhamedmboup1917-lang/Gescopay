import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/authStore';
import { CURRENT_USER } from '@/constants/mockData';
import { T } from '@/constants/i18n';
import { TOUCH_MIN, contentContainer, TS } from '@/constants/Responsive';

export default function SuccessScreen() {
  const insets = useSafeAreaInsets();
  const { login } = useAuthStore();
  
  // Animation state
  const [scaleAnim] = useState(new Animated.Value(0.3));
  const [opacityAnim] = useState(new Animated.Value(0));
  const [btnOpacity] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 40,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(btnOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleGetStarted = () => {
    login(CURRENT_USER, 'demo_token_gescopay');
    router.replace('/(user)/home');
  };

  return (
    <LinearGradient colors={['#0A2342', '#143567']} style={styles.gradient}>
      {/* Background decoration bubbles */}
      <View style={[styles.bubble, { top: 100, left: 50, transform: [{ scale: 0.8 }] }]} />
      <View style={[styles.bubble, { top: 220, right: 40, transform: [{ scale: 1.2 }] }]} />
      <View style={[styles.bubble, { bottom: 200, left: 80, transform: [{ scale: 0.6 }] }]} />

      <View style={[styles.container, contentContainer, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 24 }]}>
        <View />

        {/* Center Success Card */}
        <Animated.View
          style={[
            styles.successCard,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          <LinearGradient
            colors={['#00A8A8', '#007575']}
            style={styles.checkCircle}
          >
            <Ionicons name="checkmark" size={64} color="#FFFFFF" />
          </LinearGradient>

          <Text style={styles.cardTitle}>{T.auth.success.title}</Text>
          <Text style={styles.cardSubtitle}>{T.auth.success.subtitle}</Text>

          <View style={styles.badgeRow}>
            <View style={styles.featureBadge}>
              <Ionicons name="wallet-outline" size={16} color="#00A8A8" />
              <Text style={styles.badgeText}>Linked Wallets</Text>
            </View>
            <View style={styles.featureBadge}>
              <Ionicons name="card-outline" size={16} color="#FF7A00" />
              <Text style={styles.badgeText}>Virtual Card Active</Text>
            </View>
          </View>
        </Animated.View>

        {/* CTA Button */}
        <Animated.View style={{ opacity: btnOpacity, width: '100%' }}>
          <TouchableOpacity
            style={[styles.primaryBtn, { minHeight: TOUCH_MIN }]}
            onPress={handleGetStarted}
            activeOpacity={0.85}
            accessibilityLabel={T.auth.success.goToDashboard}
          >
            <LinearGradient
              colors={['#00A8A8', '#007575']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.primaryGradient}
            >
              <Text style={styles.primaryBtnText}>{T.auth.success.goToDashboard}</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  bubble: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 168, 168, 0.05)',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  successCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 24,
    paddingVertical: 40,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  checkCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    shadowColor: '#00A8A8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 22,
    textAlign: 'center',
    paddingHorizontal: 12,
    marginBottom: 28,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  featureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  primaryBtn: {
    width: '100%',
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
    fontSize: 17,
    fontWeight: '700',
  },
});
