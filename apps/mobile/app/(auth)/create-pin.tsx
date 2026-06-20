import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T } from '@/constants/i18n';
import { TOUCH_MIN, contentContainer, TS } from '@/constants/Responsive';

const PIN_LENGTH = 6;
const { width } = Dimensions.get('window');

export default function CreatePinScreen() {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<'create' | 'confirm'>('create');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleKeyPress = async (num: string) => {
    setError('');
    
    if (step === 'create') {
      if (pin.length < PIN_LENGTH) {
        const nextPin = pin + num;
        setPin(nextPin);
        
        if (nextPin.length === PIN_LENGTH) {
          setIsLoading(true);
          await new Promise((r) => setTimeout(r, 600));
          setIsLoading(false);
          setStep('confirm');
        }
      }
    } else {
      if (confirmPin.length < PIN_LENGTH) {
        const nextConfirm = confirmPin + num;
        setConfirmPin(nextConfirm);

        if (nextConfirm.length === PIN_LENGTH) {
          setIsLoading(true);
          await new Promise((r) => setTimeout(r, 800));
          setIsLoading(false);
          
          if (pin === nextConfirm) {
            router.replace('/(auth)/biometrics');
          } else {
            setError('PIN codes do not match. Please try again.');
            setConfirmPin('');
            setPin('');
            setStep('create');
          }
        }
      }
    }
  };

  const handleBackspace = () => {
    setError('');
    if (step === 'create') {
      setPin(pin.slice(0, -1));
    } else {
      setConfirmPin(confirmPin.slice(0, -1));
    }
  };

  const currentVal = step === 'create' ? pin : confirmPin;

  return (
    <LinearGradient colors={['#0A2342', '#143567']} style={styles.gradient}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={[styles.content, contentContainer, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              {step === 'create' ? T.auth.pin.title : T.auth.pin.confirm}
            </Text>
            <Text style={styles.subtitle}>
              {step === 'create'
                ? 'This 6-digit PIN code will secure your transactions and app access.'
                : 'Please enter your PIN again to confirm.'}
            </Text>
          </View>

          {/* Dots view */}
          <View style={styles.dotsRow}>
            {Array.from({ length: PIN_LENGTH }).map((_, idx) => {
              const hasVal = currentVal.length > idx;
              return (
                <View
                  key={idx}
                  style={[
                    styles.dot,
                    hasVal ? styles.dotFilled : null,
                    error ? styles.dotError : null,
                  ]}
                />
              );
            })}
          </View>

          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}

          {isLoading ? (
            <View style={styles.loader}>
              <ActivityIndicator color="#00A8A8" />
            </View>
          ) : (
            <View style={{ height: 24 }} />
          )}

          {/* Keypad */}
          <View style={styles.keypad}>
            <View style={styles.row}>
              {['1', '2', '3'].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={[styles.key, { minHeight: TOUCH_MIN }]}
                  onPress={() => handleKeyPress(num)}
                  disabled={isLoading}
                >
                  <Text style={styles.keyText}>{num}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.row}>
              {['4', '5', '6'].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={[styles.key, { minHeight: TOUCH_MIN }]}
                  onPress={() => handleKeyPress(num)}
                  disabled={isLoading}
                >
                  <Text style={styles.keyText}>{num}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.row}>
              {['7', '8', '9'].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={[styles.key, { minHeight: TOUCH_MIN }]}
                  onPress={() => handleKeyPress(num)}
                  disabled={isLoading}
                >
                  <Text style={styles.keyText}>{num}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.row}>
              <View style={styles.keyEmpty} />
              <TouchableOpacity
                style={[styles.key, { minHeight: TOUCH_MIN }]}
                onPress={() => handleKeyPress('0')}
                disabled={isLoading}
              >
                <Text style={styles.keyText}>0</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.key, { minHeight: TOUCH_MIN }]}
                onPress={handleBackspace}
                disabled={isLoading || currentVal.length === 0}
              >
                <Ionicons name="backspace-outline" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 20, justifyContent: 'space-between' },
  header: { alignItems: 'center', marginTop: 20 },
  title: { fontSize: 26, fontWeight: '800', color: '#FFFFFF', marginBottom: 12, textAlign: 'center' },
  subtitle: { fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: 22, textAlign: 'center', paddingHorizontal: 16 },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginVertical: 30,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'transparent',
  },
  dotFilled: {
    backgroundColor: '#00A8A8',
    borderColor: '#00A8A8',
  },
  dotError: {
    borderColor: '#EF4444',
    backgroundColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
  loader: {
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keypad: {
    width: '100%',
    gap: 12,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  key: {
    flex: 1,
    marginHorizontal: 4,
    aspectRatio: 1.5,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  keyEmpty: {
    flex: 1,
    marginHorizontal: 4,
    aspectRatio: 1.5,
  },
  keyText: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
