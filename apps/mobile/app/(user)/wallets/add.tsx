import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Shadows } from '@/constants/Colors';
import { WALLET_PROVIDERS } from '@/constants/mockData';

const STEPS = ['Sélectionner', 'Authentifier', 'Vérifier', 'Succès'];

export default function AddWalletScreen() {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const [selectedProvider, setSelectedProvider] = useState<typeof WALLET_PROVIDERS[0] | null>(null);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      // Auto-focus next — simplified for cross-platform
    }
    if (newOtp.every((v) => v !== '')) {
      setTimeout(() => handleVerify(newOtp.join('')), 100);
    }
  };

  const handleVerify = async (code: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsLoading(false);
    setStep(3);
  };

  if (step === 3) {
    return (
      <View style={[styles.successScreen, { paddingTop: insets.top }]}>
        <LinearGradient colors={['#0A2342', '#00A8A8']} style={StyleSheet.absoluteFill} />
        <View style={styles.successContent}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark" size={48} color="#FFF" />
          </View>
          <Text style={styles.successTitle}>Wallet connecté !</Text>
          <Text style={styles.successSubtitle}>
            {selectedProvider?.name} a été ajouté avec succès à votre compte GescoPay.
          </Text>
          <View style={[styles.providerPill, { backgroundColor: `${selectedProvider?.color ?? Colors.primary}30`, borderColor: `${selectedProvider?.color ?? Colors.primary}50` }]}>
            <View style={[styles.providerDot, { backgroundColor: selectedProvider?.color ?? Colors.primary }]} />
            <Text style={[styles.providerPillText, { color: selectedProvider?.color ?? Colors.primary }]}>
              {selectedProvider?.name}
            </Text>
          </View>
          <TouchableOpacity style={styles.doneBtn} onPress={() => router.replace('/(user)/wallets/index' as any)}>
            <Text style={styles.doneBtnText}>Voir mes wallets</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => step > 0 ? setStep(step - 1) : router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.navy} />
        </TouchableOpacity>
        <Text style={styles.title}>Ajouter un wallet</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Step progress */}
      <View style={styles.stepProgress}>
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, i <= step && styles.stepCircleActive]}>
                {i < step ? (
                  <Ionicons name="checkmark" size={12} color="#FFF" />
                ) : (
                  <Text style={styles.stepNumber}>{i + 1}</Text>
                )}
              </View>
              <Text style={[styles.stepLabel, i === step && styles.stepLabelActive]}>{s}</Text>
            </View>
            {i < STEPS.length - 1 && <View style={[styles.stepConnector, i < step && styles.stepConnectorActive]} />}
          </React.Fragment>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}>
        {/* STEP 0: SELECT PROVIDER */}
        {step === 0 && (
          <View>
            <Text style={styles.stepTitle}>Choisissez votre wallet</Text>
            <Text style={styles.stepSubtitle}>Sélectionnez le portefeuille mobile que vous souhaitez connecter.</Text>
            <View style={styles.providersList}>
              {WALLET_PROVIDERS.map((provider) => (
                <TouchableOpacity
                  key={provider.id}
                  style={[styles.providerCard, selectedProvider?.id === provider.id && styles.providerCardActive]}
                  onPress={() => { setSelectedProvider(provider); setStep(1); }}
                >
                  <View style={[styles.providerIconWrapper, { backgroundColor: `${provider.color}15` }]}>
                    <View style={[styles.providerColorDot, { backgroundColor: provider.color }]} />
                  </View>
                  <View style={styles.providerInfo}>
                    <Text style={styles.providerName}>{provider.name}</Text>
                    <Text style={styles.providerCountries}>{provider.country.join(', ')}</Text>
                  </View>
                  <View style={[styles.providerStatus, { backgroundColor: `${Colors.success}15` }]}>
                    <Text style={[styles.providerStatusText, { color: Colors.success }]}>Disponible</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={Colors.muted} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* STEP 1: PHONE */}
        {step === 1 && selectedProvider && (
          <View style={styles.stepContent}>
            <View style={[styles.selectedProviderBanner, { backgroundColor: `${selectedProvider.color}12`, borderColor: `${selectedProvider.color}30` }]}>
              <View style={[styles.providerIconWrapper, { backgroundColor: `${selectedProvider.color}20` }]}>
                <View style={[styles.providerColorDot, { backgroundColor: selectedProvider.color }]} />
              </View>
              <Text style={[styles.selectedProviderName, { color: selectedProvider.color }]}>{selectedProvider.name}</Text>
            </View>
            <Text style={styles.stepTitle}>Numéro de téléphone</Text>
            <Text style={styles.stepSubtitle}>Entrez le numéro associé à votre compte {selectedProvider.name}.</Text>
            <View style={styles.phoneInputContainer}>
              <View style={styles.countryCode}>
                <Text style={styles.countryCodeText}>🇸🇳 +221</Text>
              </View>
              <TextInput
                style={styles.phoneInput}
                placeholder="77 000 00 00"
                placeholderTextColor={Colors.muted}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                maxLength={12}
              />
            </View>
            <TouchableOpacity
              style={[styles.continueBtn, !phone && styles.continueBtnDisabled]}
              onPress={() => phone && setStep(2)}
              disabled={!phone}
            >
              <LinearGradient
                colors={phone ? [selectedProvider.color, selectedProvider.gradientColors[1] ?? selectedProvider.color] : [Colors.border, Colors.border]}
                style={styles.continueGradient}
              >
                <Text style={styles.continueBtnText}>Envoyer le code OTP</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 2: OTP */}
        {step === 2 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Code de vérification</Text>
            <Text style={styles.stepSubtitle}>Entrez le code à 6 chiffres envoyé au {phone}.</Text>
            <View style={styles.otpContainer}>
              {otp.map((digit, i) => (
                <TextInput
                  key={i}
                  style={[styles.otpInput, digit && styles.otpInputFilled]}
                  value={digit}
                  onChangeText={(v) => handleOtpChange(v.slice(-1), i)}
                  keyboardType="numeric"
                  maxLength={1}
                  textAlign="center"
                />
              ))}
            </View>
            {isLoading && (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Vérification en cours...</Text>
              </View>
            )}
            <TouchableOpacity style={styles.resendBtn}>
              <Text style={styles.resendText}>Renvoyer le code dans 00:30</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center', ...Shadows.sm },
  title: { fontSize: 16, fontWeight: '800', color: Colors.navy },
  stepProgress: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 28 },
  stepItem: { alignItems: 'center', gap: 4 },
  stepCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  stepCircleActive: { backgroundColor: Colors.primary },
  stepNumber: { fontSize: 12, fontWeight: '700', color: Colors.muted },
  stepLabel: { fontSize: 9, color: Colors.textMuted, fontWeight: '600' },
  stepLabelActive: { color: Colors.primary },
  stepConnector: { flex: 1, height: 2, backgroundColor: Colors.border, marginBottom: 20 },
  stepConnectorActive: { backgroundColor: Colors.primary },
  scroll: { paddingHorizontal: 20 },
  stepTitle: { fontSize: 22, fontWeight: '800', color: Colors.navy, marginBottom: 8 },
  stepSubtitle: { fontSize: 14, color: Colors.textSecondary, marginBottom: 24, lineHeight: 22 },
  stepContent: { gap: 16 },
  providersList: { gap: 12 },
  providerCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: Colors.white, borderRadius: 16, padding: 16,
    borderWidth: 1.5, borderColor: 'transparent', ...Shadows.sm,
  },
  providerCardActive: { borderColor: Colors.primary },
  providerIconWrapper: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  providerColorDot: { width: 18, height: 18, borderRadius: 9 },
  providerInfo: { flex: 1 },
  providerName: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  providerCountries: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  providerStatus: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4 },
  providerStatusText: { fontSize: 11, fontWeight: '700' },
  selectedProviderBanner: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 14, padding: 14, borderWidth: 1 },
  selectedProviderName: { fontSize: 16, fontWeight: '800' },
  phoneInputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: 14, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden' },
  countryCode: { backgroundColor: Colors.background, paddingHorizontal: 14, paddingVertical: 16, borderRightWidth: 1, borderRightColor: Colors.border },
  countryCodeText: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  phoneInput: { flex: 1, height: 54, paddingHorizontal: 14, fontSize: 16, color: Colors.textPrimary },
  continueBtn: { borderRadius: 16, overflow: 'hidden' },
  continueBtnDisabled: { opacity: 0.5 },
  continueGradient: { paddingVertical: 18, alignItems: 'center' },
  continueBtnText: { color: '#FFF', fontSize: 17, fontWeight: '700' },
  otpContainer: { flexDirection: 'row', gap: 10, justifyContent: 'center', marginVertical: 20 },
  otpInput: {
    width: 48, height: 56, borderRadius: 14, backgroundColor: Colors.white,
    borderWidth: 1.5, borderColor: Colors.border, fontSize: 22, fontWeight: '800', color: Colors.navy,
  },
  otpInputFilled: { borderColor: Colors.primary, backgroundColor: `${Colors.primary}08` },
  loadingContainer: { alignItems: 'center', paddingVertical: 12 },
  loadingText: { color: Colors.primary, fontWeight: '600' },
  resendBtn: { alignItems: 'center' },
  resendText: { color: Colors.muted, fontSize: 13 },
  // Success
  successScreen: { flex: 1 },
  successContent: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  successIcon: { width: 88, height: 88, borderRadius: 44, backgroundColor: Colors.success, alignItems: 'center', justifyContent: 'center', marginBottom: 24, shadowColor: Colors.success, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 20, elevation: 10 },
  successTitle: { fontSize: 28, fontWeight: '800', color: '#FFF', marginBottom: 12 },
  successSubtitle: { fontSize: 15, color: 'rgba(255,255,255,0.65)', textAlign: 'center', lineHeight: 24, marginBottom: 24 },
  providerPill: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, marginBottom: 32 },
  providerDot: { width: 8, height: 8, borderRadius: 4 },
  providerPillText: { fontSize: 14, fontWeight: '700' },
  doneBtn: { width: '100%', backgroundColor: Colors.primary, borderRadius: 16, paddingVertical: 18, alignItems: 'center' },
  doneBtnText: { color: '#FFF', fontSize: 17, fontWeight: '700' },
});
