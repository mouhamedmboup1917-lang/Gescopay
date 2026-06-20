import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T } from '@/constants/i18n';
import { TOUCH_MIN, contentContainer, TS } from '@/constants/Responsive';

export default function OtpScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const destination = (params.destination as string) || '+221 77 123 45 67';
  
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(59);
  const [error, setError] = useState('');
  const inputRef = useRef<TextInput>(null);

  // Focus input on mount
  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 500);
  }, []);

  // Resend code timer
  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleTextChange = async (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    setCode(cleaned);
    setError('');

    if (cleaned.length === 6) {
      setIsLoading(true);
      await new Promise((r) => setTimeout(r, 1500));
      setIsLoading(false);

      if (cleaned === '123456' || cleaned === '654321' || cleaned.length === 6) {
        router.replace('/(auth)/create-pin');
      } else {
        setError('Incorrect verification code. Please try again.');
        setCode('');
      }
    }
  };

  const handleResend = () => {
    if (timer > 0) return;
    setTimer(59);
    setCode('');
    setError('');
  };

  return (
    <LinearGradient colors={['#0A2342', '#143567']} style={styles.gradient}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={[styles.content, contentContainer, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 40 }]}>
          {/* Back button */}
          <TouchableOpacity style={[styles.backBtn, { minHeight: TOUCH_MIN }]} onPress={() => router.back()} accessibilityLabel={T.common.back}>
            <Ionicons name="arrow-back" size={24} color="rgba(255,255,255,0.8)" />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{T.auth.otp.title}</Text>
            <Text style={styles.subtitle}>
              {T.auth.otp.subtitle(destination)}
            </Text>
          </View>

          {/* Hidden TextInput */}
          <TextInput
            ref={inputRef}
            style={styles.hiddenInput}
            value={code}
            onChangeText={handleTextChange}
            maxLength={6}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            autoFocus
          />

          {/* OTP Grid display */}
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => inputRef.current?.focus()}
            style={styles.otpGrid}
          >
            {Array.from({ length: 6 }).map((_, idx) => {
              const char = code[idx] || '';
              const isFocused = code.length === idx;
              return (
                <View
                  key={idx}
                  style={[
                    styles.otpBox,
                    char ? styles.otpBoxFilled : null,
                    isFocused ? styles.otpBoxFocused : null,
                    error ? styles.otpBoxError : null,
                  ]}
                >
                  <Text style={styles.otpText}>
                    {char}
                  </Text>
                  {isFocused && <View style={styles.cursor} />}
                </View>
              );
            })}
          </TouchableOpacity>

          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}

          {isLoading && (
            <View style={styles.loaderContainer}>
              <ActivityIndicator color="#00A8A8" size="large" />
              <Text style={styles.loaderText}>{T.common.processing}</Text>
            </View>
          )}

          {/* Timer & Resend */}
          <View style={styles.resendContainer}>
            {timer > 0 ? (
              <Text style={styles.timerText}>
                Resend code in <Text style={styles.boldText}>{timer}s</Text>
              </Text>
            ) : (
              <TouchableOpacity onPress={handleResend} style={[styles.resendBtn, { minHeight: TOUCH_MIN, justifyContent: 'center' }]}>
                <Text style={styles.resendText}>{T.auth.otp.resend}</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Info pill */}
          <View style={styles.infoPill}>
            <Ionicons name="information-circle-outline" size={18} color="#00A8A8" />
            <Text style={styles.infoPillText}>
              For testing purposes, you can enter any 6-digit code.
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 20 },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  header: { marginBottom: 40 },
  title: { fontSize: 32, fontWeight: '800', color: '#FFFFFF', marginBottom: 12 },
  subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.6)', lineHeight: 24 },
  boldText: { color: '#FFFFFF', fontWeight: '700' },
  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
  otpGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
    gap: 8,
  },
  otpBox: {
    flex: 1,
    aspectRatio: 0.85,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  otpBoxFilled: {
    borderColor: 'rgba(0, 168, 168, 0.4)',
    backgroundColor: 'rgba(0, 168, 168, 0.05)',
  },
  otpBoxFocused: {
    borderColor: '#00A8A8',
    backgroundColor: 'rgba(0, 168, 168, 0.1)',
  },
  otpBoxError: {
    borderColor: '#EF4444',
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
  otpText: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cursor: {
    position: 'absolute',
    width: 2,
    height: 20,
    backgroundColor: '#00A8A8',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  loaderContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  loaderText: {
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 8,
    fontSize: 14,
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  timerText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  resendBtn: {
    paddingHorizontal: 20,
  },
  resendText: {
    color: '#00A8A8',
    fontSize: 15,
    fontWeight: '700',
  },
  infoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0, 168, 168, 0.12)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 168, 168, 0.25)',
  },
  infoPillText: {
    flex: 1,
    color: '#00A8A8',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
});
