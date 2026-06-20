import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/authStore';
import { CURRENT_USER } from '@/constants/mockData';
import { Colors } from '@/constants/Colors';
import { T } from '@/constants/i18n';
import { TOUCH_MIN, contentContainer, TS } from '@/constants/Responsive';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<'email' | 'phone'>('email');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();

  const handleLogin = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsLoading(false);
    router.push({
      pathname: '/(auth)/otp',
      params: { destination: identifier || 'your email / phone' }
    });
  };

  const handleBiometricLogin = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsLoading(false);
    login(CURRENT_USER, 'demo_token_gescopay');
    router.replace('/(auth)/success');
  };

  return (
    <LinearGradient colors={['#0A2342', '#143567']} style={styles.gradient}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 40 }]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={contentContainer}>
            {/* Back button */}
            <TouchableOpacity style={[styles.backBtn, { minHeight: TOUCH_MIN }]} onPress={() => router.back()} accessibilityLabel={T.common.back}>
              <Ionicons name="arrow-back" size={24} color="rgba(255,255,255,0.8)" />
            </TouchableOpacity>

            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>{T.auth.login.title}</Text>
              <Text style={styles.subtitle}>{T.auth.login.subtitle}</Text>
            </View>

            {/* Tab selector */}
            <View style={styles.tabContainer}>
              {(['email', 'phone'] as const).map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.tab, tab === t && styles.tabActive, { minHeight: TOUCH_MIN }]}
                  onPress={() => setTab(t)}
                >
                  <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
                    {t === 'email' ? T.auth.login.email : T.auth.login.phone}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Form */}
            <View style={styles.form}>
              {/* Identifier */}
              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <Ionicons
                    name={tab === 'email' ? 'mail-outline' : 'call-outline'}
                    size={20}
                    color="rgba(255,255,255,0.5)"
                  />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder={tab === 'email' ? T.auth.login.emailPlaceholder : T.auth.login.phonePlaceholder}
                  placeholderTextColor="rgba(255,255,255,0.35)"
                  value={identifier}
                  onChangeText={setIdentifier}
                  keyboardType={tab === 'email' ? 'email-address' : 'phone-pad'}
                  autoCapitalize="none"
                  autoComplete={tab === 'email' ? 'email' : 'tel'}
                />
              </View>

              {/* Password */}
              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <Ionicons name="lock-closed-outline" size={20} color="rgba(255,255,255,0.5)" />
                </View>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder={T.auth.login.passwordPlaceholder}
                  placeholderTextColor="rgba(255,255,255,0.35)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoComplete="password"
                />
                <TouchableOpacity
                  style={[styles.eyeButton, { minHeight: TOUCH_MIN }]}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="rgba(255,255,255,0.5)"
                  />
                </TouchableOpacity>
              </View>

              {/* Forgot password */}
              <TouchableOpacity style={styles.forgotPassword} accessibilityLabel={T.auth.login.forgotPassword}>
                <Text style={styles.forgotText}>{T.auth.login.forgotPassword}</Text>
              </TouchableOpacity>

              {/* Login button */}
              <TouchableOpacity
                onPress={handleLogin}
                disabled={isLoading}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={['#00A8A8', '#007575']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.loginButton}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <>
                      <Text style={styles.loginButtonText}>{T.auth.login.signIn}</Text>
                      <Ionicons name="arrow-forward" size={20} color="#FFF" />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.biometricButton, { minHeight: TOUCH_MIN }]}
                onPress={handleBiometricLogin}
                activeOpacity={0.85}
              >
                <View style={styles.biometricIcon}>
                  <Ionicons name="finger-print-outline" size={28} color="#00A8A8" />
                </View>
                <Text style={styles.biometricText}>{T.auth.login.biometricSignIn}</Text>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.dividerRow}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.divider} />
              </View>

              {/* Social login */}
              <View style={styles.socialRow}>
                {[
                  { icon: 'logo-google', label: 'Google' },
                  { icon: 'logo-apple', label: 'Apple' },
                ].map((social) => (
                  <TouchableOpacity key={social.label} style={[styles.socialButton, { minHeight: TOUCH_MIN }]} activeOpacity={0.85}>
                    <Ionicons name={social.icon as any} size={20} color="#FFFFFF" />
                    <Text style={styles.socialText}>{social.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Register link */}
            <View style={styles.registerRow}>
              <Text style={styles.registerText}>{T.auth.login.noAccount} </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/register')} style={{ minHeight: TOUCH_MIN, justifyContent: 'center' }}>
                <Text style={styles.registerLink}>{T.auth.login.createAccount}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20 },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  header: { marginBottom: 32 },
  title: { fontSize: 32, fontWeight: '800', color: '#FFFFFF', marginBottom: 8 },
  subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.55)', lineHeight: 24 },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: 4,
    marginBottom: 28,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabActive: { backgroundColor: '#00A8A8' },
  tabText: { fontSize: 15, fontWeight: '600', color: 'rgba(255,255,255,0.5)' },
  tabTextActive: { color: '#FFFFFF' },
  form: { gap: 16 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  inputIcon: {
    width: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    height: 56,
    color: '#FFFFFF',
    fontSize: 16,
  },
  passwordInput: { paddingRight: 16 },
  eyeButton: {
    width: 52,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  forgotPassword: { alignSelf: 'flex-end', paddingVertical: 4 },
  forgotText: { color: '#00A8A8', fontSize: 14, fontWeight: '600' },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 16,
    paddingVertical: 18,
  },
  loginButtonText: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: 'rgba(0,168,168,0.1)',
    borderRadius: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,168,168,0.25)',
  },
  biometricIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(0,168,168,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  biometricText: { color: '#00A8A8', fontSize: 15, fontWeight: '600' },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 4,
  },
  divider: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.1)' },
  dividerText: { color: 'rgba(255,255,255,0.4)', fontSize: 13 },
  socialRow: { flexDirection: 'row', gap: 12 },
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
    borderColor: 'rgba(255,255,255,0.1)',
  },
  socialText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  registerText: { color: 'rgba(255,255,255,0.5)', fontSize: 15 },
  registerLink: { color: '#00A8A8', fontSize: 15, fontWeight: '700' },
});
