import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T } from '@/constants/i18n';
import { TOUCH_MIN, contentContainer, TS } from '@/constants/Responsive';

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={['#0A2342', '#143567']}
      style={styles.container}
    >
      {/* Decorative elements */}
      <View style={styles.decorCircle1} />
      <View style={styles.decorCircle2} />
      <View style={styles.decorCircle3} />

      <View style={[styles.mainLayout, contentContainer]}>
        {/* Top logo */}
        <View style={[styles.header, { paddingTop: insets.top + 24 }]}>
          <View style={styles.logoRow}>
            <View style={styles.logoMark}>
              <Text style={styles.logoMarkText}>G</Text>
            </View>
            <Text style={styles.logoName}>GescoPay</Text>
          </View>
          <View style={styles.taglinePill}>
            <View style={styles.taglineDot} />
            <Text style={styles.taglinePillText}>African Financial Super-App</Text>
          </View>
        </View>

        {/* Hero section */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>
            Welcome to{'\n'}
            <Text style={styles.heroTitleAccent}>GescoPay</Text>
          </Text>
          <Text style={styles.heroSubtitle}>
            Manage all your mobile wallets, make payments and grow your business from a single application.
          </Text>

          {/* Feature pills */}
          <View style={styles.pillsRow}>
            {['Wave', 'Orange', 'Free', 'MTN', '+3'].map((label) => (
              <View key={label} style={styles.walletPill}>
                <Text style={styles.walletPillText}>{label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* CTA Buttons */}
        <View style={[styles.ctaContainer, { paddingBottom: insets.bottom + 24 }]}>
          {/* Register */}
          <TouchableOpacity
            style={[styles.primaryButton, { minHeight: TOUCH_MIN }]}
            onPress={() => router.push('/(auth)/register')}
            activeOpacity={0.85}
            accessibilityLabel={T.auth.register.createAccount}
          >
            <LinearGradient
              colors={['#00A8A8', '#007575']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.primaryGradient}
            >
              <Text style={styles.primaryButtonText}>{T.auth.register.createAccount}</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>

          {/* Login */}
          <TouchableOpacity
            style={[styles.secondaryButton, { minHeight: TOUCH_MIN, justifyContent: 'center' }]}
            onPress={() => router.push('/(auth)/login')}
            activeOpacity={0.85}
            accessibilityLabel={T.auth.register.signIn}
          >
            <Text style={styles.secondaryButtonText}>{T.auth.register.signIn}</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.divider} />
          </View>

          {/* Social login */}
          <View style={styles.socialRow}>
            {[
              { icon: 'logo-google', label: 'Google' },
              { icon: 'logo-apple', label: 'Apple' },
            ].map((social) => (
              <TouchableOpacity key={social.label} style={[styles.socialButton, { minHeight: TOUCH_MIN }]} activeOpacity={0.85}>
                <Ionicons name={social.icon as any} size={22} color="#FFFFFF" />
                <Text style={styles.socialButtonText}>{social.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.legalText}>
            By continuing, you agree to our{' '}
            <Text style={styles.legalLink}>Terms of Use</Text>
            {' '}and our{' '}
            <Text style={styles.legalLink}>Privacy Policy</Text>
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mainLayout: { flex: 1, justifyContent: 'space-between' },
  decorCircle1: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: 'rgba(0,168,168,0.08)',
  },
  decorCircle2: {
    position: 'absolute',
    top: 150,
    left: -80,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,122,0,0.06)',
  },
  decorCircle3: {
    position: 'absolute',
    bottom: 200,
    right: -60,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(0,168,168,0.06)',
  },
  header: {
    paddingHorizontal: 8,
    gap: 12,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoMark: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#00A8A8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoMarkText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  logoName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  taglinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,168,168,0.15)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(0,168,168,0.3)',
  },
  taglineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00A8A8',
  },
  taglinePillText: {
    fontSize: 12,
    color: '#00A8A8',
    fontWeight: '600',
  },
  hero: {
    flex: 1,
    paddingHorizontal: 8,
    justifyContent: 'center',
    marginVertical: 20,
  },
  heroTitle: {
    fontSize: 40,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 50,
    marginBottom: 16,
  },
  heroTitleAccent: {
    color: '#00A8A8',
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 26,
    marginBottom: 28,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  walletPill: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  walletPillText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    fontWeight: '500',
  },
  ctaContainer: {
    paddingHorizontal: 8,
    gap: 12,
  },
  primaryButton: {
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
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  secondaryButton: {
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 17,
    fontWeight: '600',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 4,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  dividerText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 13,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  socialButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
  legalText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.35)',
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 4,
  },
  legalLink: {
    color: 'rgba(0,168,168,0.8)',
    fontWeight: '600',
  },
});
