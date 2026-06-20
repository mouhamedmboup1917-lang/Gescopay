import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/authStore';
import { T } from '@/constants/i18n';
import { TOUCH_MIN, contentContainer, TS } from '@/constants/Responsive';

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', country: 'SN' });
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
    router.push({
      pathname: '/(auth)/otp',
      params: { destination: form.phone || '+221 77 123 45 67' }
    });
  };

  const fields = [
    { key: 'firstName' as const, label: T.auth.register.firstName, icon: 'person-outline', type: 'default' as const },
    { key: 'lastName' as const, label: T.auth.register.lastName, icon: 'person-outline', type: 'default' as const },
    { key: 'email' as const, label: T.auth.register.email, icon: 'mail-outline', type: 'email-address' as const },
    { key: 'phone' as const, label: T.auth.register.phone, icon: 'call-outline', type: 'phone-pad' as const },
  ];

  return (
    <LinearGradient colors={['#0A2342', '#143567']} style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 40 }]} keyboardShouldPersistTaps="handled">
          <View style={contentContainer}>
            <TouchableOpacity style={[styles.backBtn, { minHeight: TOUCH_MIN }]} onPress={() => router.back()} accessibilityLabel={T.common.back}>
              <Ionicons name="arrow-back" size={24} color="rgba(255,255,255,0.8)" />
            </TouchableOpacity>
            <View style={styles.header}>
              <Text style={styles.title}>{T.auth.register.title}</Text>
              <Text style={styles.subtitle}>{T.auth.register.subtitle}</Text>
            </View>
            <View style={styles.form}>
              {fields.map((f) => (
                <View key={f.key} style={styles.inputContainer}>
                  <View style={styles.inputIcon}>
                    <Ionicons name={f.icon as any} size={20} color="rgba(255,255,255,0.5)" />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder={f.label}
                    placeholderTextColor="rgba(255,255,255,0.35)"
                    value={form[f.key]}
                    onChangeText={(v) => setForm({ ...form, [f.key]: v })}
                    keyboardType={f.type}
                    autoCapitalize={f.key === 'email' ? 'none' : 'words'}
                  />
                </View>
              ))}
              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <Ionicons name="lock-closed-outline" size={20} color="rgba(255,255,255,0.5)" />
                </View>
                <TextInput
                  style={[styles.input, { paddingRight: 52 }]}
                  placeholder={T.auth.login.passwordLabel}
                  placeholderTextColor="rgba(255,255,255,0.35)"
                  value={form.password}
                  onChangeText={(v) => setForm({ ...form, password: v })}
                  secureTextEntry={!showPass}
                />
                <TouchableOpacity style={[styles.eyeBtn, { minHeight: TOUCH_MIN }]} onPress={() => setShowPass(!showPass)}>
                  <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={20} color="rgba(255,255,255,0.5)" />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity onPress={handleRegister} disabled={isLoading} style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 16 }}>
              <LinearGradient colors={['#00A8A8', '#007575']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.submitBtn}>
                {isLoading ? <ActivityIndicator color="#FFF" /> : <><Text style={styles.submitText}>{T.auth.register.createAccount}</Text><Ionicons name="arrow-forward" size={20} color="#FFF" /></>}
              </LinearGradient>
            </TouchableOpacity>
            <Text style={styles.termsText}>By creating an account, you agree to our <Text style={styles.termsLink}>Terms & Conditions</Text> and our <Text style={styles.termsLink}>Privacy Policy</Text>.</Text>
            <View style={styles.loginRow}>
              <Text style={styles.loginText}>{T.auth.register.haveAccount} </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/login')} style={{ minHeight: TOUCH_MIN, justifyContent: 'center' }}><Text style={styles.loginLink}>{T.auth.register.signIn}</Text></TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 20 },
  backBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center', marginBottom: 28 },
  header: { marginBottom: 28 },
  title: { fontSize: 30, fontWeight: '800', color: '#FFF', marginBottom: 8 },
  subtitle: { fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 22 },
  form: { gap: 14, marginBottom: 20 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  inputIcon: { width: 50, alignItems: 'center' },
  input: { flex: 1, height: 54, color: '#FFF', fontSize: 15 },
  eyeBtn: { width: 50, height: 54, alignItems: 'center', justifyContent: 'center' },
  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 18 },
  submitText: { color: '#FFF', fontSize: 17, fontWeight: '700' },
  termsText: { fontSize: 12, color: 'rgba(255,255,255,0.35)', textAlign: 'center', lineHeight: 18, marginBottom: 16 },
  termsLink: { color: 'rgba(0,168,168,0.8)', fontWeight: '600' },
  loginRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  loginText: { color: 'rgba(255,255,255,0.5)', fontSize: 15 },
  loginLink: { color: '#00A8A8', fontSize: 15, fontWeight: '700' },
});
