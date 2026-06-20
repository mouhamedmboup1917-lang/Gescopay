import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Shadows } from '@/constants/Colors';
import { MOCK_WALLETS } from '@/constants/mockData';
import { formatCurrency } from '@/lib/formatters';
import { T } from '@/constants/i18n';
import { PADDING_H, contentContainer, TS, TOUCH_MIN } from '@/constants/Responsive';

const { width } = Dimensions.get('window');
const SCAN_SIZE = Math.min(width * 0.7, 280);

const MOCK_SCAN_RESULT = {
  merchantName: 'Diallo Restaurant & Catering',
  merchantId: 'merchant_001',
  amount: null, // dynamic
  currency: 'XOF',
};

export default function QRScanScreen() {
  const insets = useSafeAreaInsets();
  const [scanStep, setScanStep] = useState<'scanning' | 'select_wallet' | 'confirm' | 'success'>('scanning');
  const [selectedWallet, setSelectedWallet] = useState(MOCK_WALLETS[0]);
  const [manualAmount, setManualAmount] = useState(5000);

  // Simulate scan after 2 seconds
  React.useEffect(() => {
    if (scanStep === 'scanning') {
      const timer = setTimeout(() => setScanStep('select_wallet'), 2000);
      return () => clearTimeout(timer);
    }
  }, [scanStep]);

  if (scanStep === 'success') {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <LinearGradient colors={['#0A2342', '#00A8A8']} style={StyleSheet.absoluteFill} />
        <View style={[styles.successContent, contentContainer]}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark" size={48} color="#FFF" />
          </View>
          <Text style={styles.successTitle}>Payment Successful!</Text>
          <Text style={styles.successAmount}>{formatCurrency(manualAmount, 'XOF')}</Text>
          <Text style={styles.successTo}>paid to {MOCK_SCAN_RESULT.merchantName}</Text>
          <TouchableOpacity style={[styles.doneBtn, { minHeight: TOUCH_MIN }]} onPress={() => router.back()}>
            <Text style={styles.doneBtnText}>{T.transfer.success.backHome}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Scanner background */}
      <View style={styles.scannerBg}>
        <LinearGradient colors={['rgba(10,35,66,0.95)', 'rgba(10,35,66,0.7)']} style={StyleSheet.absoluteFill} />

        <View style={contentContainer}>
          {/* Header */}
          <View style={[styles.scanHeader, { paddingTop: insets.top }]}>
            <TouchableOpacity onPress={() => router.back()} style={[styles.closeBtn, { minHeight: TOUCH_MIN }]} accessibilityLabel={T.common.close}>
              <Ionicons name="close" size={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.scanTitle}>{T.qr.scanTitle}</Text>
            <TouchableOpacity style={[styles.torchBtn, { minHeight: TOUCH_MIN }]} accessibilityLabel="Toggle Torch">
              <Ionicons name="flashlight-outline" size={22} color="#FFF" />
            </TouchableOpacity>
          </View>

          {scanStep === 'scanning' && (
            <View style={styles.scanContent}>
              {/* Scan frame */}
              <View style={styles.scanFrameWrapper}>
                <View style={styles.scanFrame}>
                  {/* Corner markers */}
                  <View style={[styles.corner, styles.cornerTL]} />
                  <View style={[styles.corner, styles.cornerTR]} />
                  <View style={[styles.corner, styles.cornerBL]} />
                  <View style={[styles.corner, styles.cornerBR]} />
                  {/* Scan line */}
                  <View style={styles.scanLine} />
                </View>
              </View>
              <Text style={styles.scanHint}>{T.qr.scanHintPay}</Text>
            </View>
          )}
        </View>

        {/* Wallet selector sheet */}
        {(scanStep === 'select_wallet' || scanStep === 'confirm') && (
          <View style={styles.sheet}>
            <View style={[styles.sheetContent, contentContainer]}>
              <View style={styles.sheetHandle} />
              {scanStep === 'select_wallet' ? (
                <>
                  <Text style={styles.sheetTitle}>Choose Wallet</Text>
                  <Text style={styles.sheetSubtitle}>Paying {MOCK_SCAN_RESULT.merchantName}</Text>
                  <Text style={styles.sheetAmount}>{formatCurrency(manualAmount, 'XOF')}</Text>

                  <View style={styles.walletsList}>
                    {MOCK_WALLETS.map((wallet) => (
                      <TouchableOpacity
                        key={wallet.id}
                        style={[styles.walletOption, selectedWallet.id === wallet.id && styles.walletOptionActive, { minHeight: TOUCH_MIN }]}
                        onPress={() => setSelectedWallet(wallet)}
                      >
                        <View style={[styles.walletDot, { backgroundColor: wallet.providerInfo.color }]} />
                        <View style={styles.walletInfo}>
                          <Text style={styles.walletName}>{wallet.providerInfo.name}</Text>
                          <Text style={styles.walletBalance}>{formatCurrency(wallet.balance, 'XOF', true)} available</Text>
                        </View>
                        {selectedWallet.id === wallet.id && <Ionicons name="checkmark-circle" size={22} color={Colors.primary} />}
                      </TouchableOpacity>
                    ))}
                  </View>

                  <TouchableOpacity style={[styles.payBtn, { minHeight: TOUCH_MIN }]} onPress={() => setScanStep('confirm')}>
                    <LinearGradient colors={['#00A8A8', '#007575']} style={styles.payBtnGradient}>
                      <Text style={styles.payBtnText}>{T.common.continue}</Text>
                      <Ionicons name="arrow-forward" size={20} color="#FFF" />
                    </LinearGradient>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.sheetTitle}>{T.transfer.titleConfirm}</Text>
                  <View style={styles.confirmCard}>
                    {[
                      { label: 'Merchant', value: MOCK_SCAN_RESULT.merchantName },
                      { label: T.transfer.from, value: selectedWallet.providerInfo.name },
                      { label: T.transfer.titleAmount, value: formatCurrency(manualAmount, 'XOF') },
                      { label: T.transfer.fee, value: formatCurrency(Math.round(manualAmount * 0.01), 'XOF') },
                    ].map((row) => (
                      <View key={row.label} style={styles.confirmRow}>
                        <Text style={styles.confirmLabel}>{row.label}</Text>
                        <Text style={styles.confirmValue}>{row.value}</Text>
                      </View>
                    ))}
                  </View>
                  <TouchableOpacity style={[styles.payBtn, { minHeight: TOUCH_MIN }]} onPress={() => setScanStep('success')}>
                    <LinearGradient colors={['#00A8A8', '#007575']} style={styles.payBtnGradient}>
                      <Ionicons name="lock-closed" size={16} color="#FFF" />
                      <Text style={styles.payBtnText}>Pay Now</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scannerBg: { flex: 1, backgroundColor: '#0A2342' },
  scanHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 20 },
  closeBtn: { width: TOUCH_MIN, height: TOUCH_MIN, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  torchBtn: { width: TOUCH_MIN, height: TOUCH_MIN, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  scanTitle: { fontSize: TS.h2, fontWeight: '700', color: '#FFF' },
  scanContent: { alignItems: 'center', justifyContent: 'center', width: '100%' },
  scanFrameWrapper: { paddingVertical: 40, alignItems: 'center', justifyContent: 'center', width: '100%' },
  scanFrame: { width: SCAN_SIZE, height: SCAN_SIZE, position: 'relative', justifyContent: 'center', alignItems: 'center' },
  corner: { position: 'absolute', width: 32, height: 32, borderColor: Colors.primary },
  cornerTL: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 8 },
  cornerTR: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 8 },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 8 },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 8 },
  scanLine: { width: '90%', height: 2, backgroundColor: Colors.primary, opacity: 0.8 },
  scanHint: { textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: 14, paddingBottom: 40 },
  sheet: { backgroundColor: Colors.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingBottom: 48 },
  sheetContent: { padding: 24, gap: 16 },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.border, alignSelf: 'center', marginBottom: 8 },
  sheetTitle: { fontSize: TS.h1, fontWeight: '800', color: Colors.navy },
  sheetSubtitle: { fontSize: 14, color: Colors.textSecondary },
  sheetAmount: { fontSize: 32, fontWeight: '800', color: Colors.navy },
  walletsList: { gap: 10 },
  walletOption: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.background, borderRadius: 14, padding: 14, borderWidth: 1.5, borderColor: Colors.border },
  walletOptionActive: { borderColor: Colors.primary, backgroundColor: `${Colors.primary}08` },
  walletDot: { width: 12, height: 12, borderRadius: 6 },
  walletInfo: { flex: 1 },
  walletName: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  walletBalance: { fontSize: 12, color: Colors.textMuted },
  payBtn: { borderRadius: 16, overflow: 'hidden' },
  payBtnGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 18 },
  payBtnText: { color: '#FFF', fontSize: 17, fontWeight: '700' },
  confirmCard: { backgroundColor: Colors.background, borderRadius: 16, padding: 16, gap: 12 },
  confirmRow: { flexDirection: 'row', justifyContent: 'space-between' },
  confirmLabel: { fontSize: 13, color: Colors.textMuted },
  confirmValue: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  // Success
  successContent: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  successIcon: { width: 88, height: 88, borderRadius: 44, backgroundColor: Colors.success, alignItems: 'center', justifyContent: 'center', marginBottom: 24, shadowColor: Colors.success, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 20, elevation: 10 },
  successTitle: { fontSize: 28, fontWeight: '800', color: '#FFF', marginBottom: 8 },
  successAmount: { fontSize: 40, fontWeight: '800', color: '#FFF', marginBottom: 4 },
  successTo: { fontSize: 15, color: 'rgba(255,255,255,0.65)', marginBottom: 40 },
  doneBtn: { width: '100%', backgroundColor: Colors.primary, borderRadius: 16, paddingVertical: 18, alignItems: 'center', justifyContent: 'center' },
  doneBtnText: { color: '#FFF', fontSize: 17, fontWeight: '700' },
});
