import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Share,
  Animated,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';
import { Colors, Shadows } from '@/constants/Colors';
import { MOCK_WALLETS, CURRENT_USER } from '@/constants/mockData';
import { formatCurrency } from '@/lib/formatters';
import { router } from 'expo-router';
import { T } from '@/constants/i18n';
import { PADDING_H, contentContainer, TS, TOUCH_MIN } from '@/constants/Responsive';

const { width } = Dimensions.get('window');
const QR_SIZE = Math.min(width - 80, 280);

const QR_DATA = JSON.stringify({
  type: 'gescopay_payment',
  userId: CURRENT_USER.id,
  name: `${CURRENT_USER.firstName} ${CURRENT_USER.lastName}`,
  wallets: MOCK_WALLETS.map((w) => ({ provider: w.provider, phone: w.phoneNumber })),
  version: '1.0',
});

export default function QRDisplayScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'receive' | 'request'>('receive');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  // Entry scale + fade
  const entryScale = useRef(new Animated.Value(0.85)).current;
  const entryOpacity = useRef(new Animated.Value(0)).current;

  // Scan line animation
  const scanLineY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(entryScale, {
        toValue: 1,
        tension: 55,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(entryOpacity, {
        toValue: 1,
        duration: 350,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    const scanLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineY, {
          toValue: QR_SIZE - 4,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(scanLineY, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );
    scanLoop.start();
    return () => scanLoop.stop();
  }, []);

  const quickAmounts = [1000, 2500, 5000, 10000, 25000, 50000];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
      >
        <View style={contentContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{T.qr.title}</Text>
            <View style={styles.headerBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveBadgeText}>{T.qr.active}</Text>
            </View>
          </View>

          {/* Tab */}
          <View style={styles.tabContainer}>
            {[
              { id: 'receive', label: `↓  ${T.qr.receive}` },
              { id: 'request', label: `✋  ${T.qr.request}` },
            ].map((t) => (
              <TouchableOpacity
                key={t.id}
                style={[styles.tab, activeTab === t.id && styles.tabActive]}
                onPress={() => setActiveTab(t.id as any)}
                accessibilityLabel={t.label}
                accessibilityRole="tab"
              >
                <Text style={[styles.tabText, activeTab === t.id && styles.tabTextActive]}>{t.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Quick Amounts */}
          {activeTab === 'request' && (
            <View style={styles.inlineAmounts}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.inlineAmountsContent}>
                <TouchableOpacity
                  style={[styles.inlineAmountBtn, selectedAmount === null && styles.inlineAmountBtnActive]}
                  onPress={() => setSelectedAmount(null)}
                >
                  <Text style={[styles.inlineAmountText, selectedAmount === null && styles.inlineAmountTextActive]}>
                    {T.qr.freeAmount}
                  </Text>
                </TouchableOpacity>
                {quickAmounts.map((amount) => (
                  <TouchableOpacity
                    key={amount}
                    style={[styles.inlineAmountBtn, selectedAmount === amount && styles.inlineAmountBtnActive]}
                    onPress={() => setSelectedAmount(selectedAmount === amount ? null : amount)}
                    accessibilityLabel={`Amount ${amount} XOF`}
                  >
                    <Text style={[styles.inlineAmountText, selectedAmount === amount && styles.inlineAmountTextActive]}>
                      {formatCurrency(amount, 'XOF', true)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* QR Card */}
          <Animated.View
            style={[
              styles.qrCard,
              {
                opacity: entryOpacity,
                transform: [{ scale: entryScale }],
              },
            ]}
            accessibilityLabel="GescoPay Payment QR Code"
            accessibilityRole="image"
          >
            {/* Top gradient */}
            <LinearGradient colors={['#0A2342', '#143567']} style={styles.qrTopBar}>
              <View style={styles.qrLogoRow}>
                <View style={styles.qrLogo}>
                  <Text style={styles.qrLogoText}>G</Text>
                </View>
                <View>
                  <Text style={styles.qrName}>{CURRENT_USER.firstName} {CURRENT_USER.lastName}</Text>
                  <Text style={styles.qrPhone}>{CURRENT_USER.phone}</Text>
                </View>
              </View>
              {selectedAmount && (
                <View style={styles.qrAmount}>
                  <Text style={styles.qrAmountLabel}>{T.qr.requestedAmount}</Text>
                  <Text style={styles.qrAmountValue}>{formatCurrency(selectedAmount, 'XOF')}</Text>
                </View>
              )}
            </LinearGradient>

            {/* QR Code */}
            <View style={styles.qrCodeContainer}>
              <View style={styles.qrCodeWrapper}>
                <View style={[styles.corner, styles.cornerTL]} />
                <View style={[styles.corner, styles.cornerTR]} />
                <View style={[styles.corner, styles.cornerBL]} />
                <View style={[styles.corner, styles.cornerBR]} />

                <QRCode
                  value={selectedAmount ? `${QR_DATA}&amount=${selectedAmount}` : QR_DATA}
                  size={QR_SIZE - 60}
                  color={Colors.navy}
                  backgroundColor="white"
                />

                <Animated.View
                  style={[
                    styles.scanLine,
                    { transform: [{ translateY: scanLineY }] },
                  ]}
                  pointerEvents="none"
                />
              </View>

              {/* Wallets accepted */}
              <View style={styles.walletsRow}>
                <Text style={styles.walletsLabel}>{T.qr.acceptedBy}</Text>
                <View style={styles.walletChips}>
                  {MOCK_WALLETS.map((w) => (
                    <View
                      key={w.id}
                      style={[styles.walletChip, { backgroundColor: `${w.providerInfo.color}18`, borderColor: `${w.providerInfo.color}50` }]}
                    >
                      <View style={[styles.walletDot, { backgroundColor: w.providerInfo.color }]} />
                      <Text style={[styles.walletChipText, { color: w.providerInfo.color }]}>
                        {w.providerInfo.shortName}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            {/* Bottom powered */}
            <View style={styles.qrBottom}>
              <Text style={styles.poweredBy}>
                {T.qr.poweredBy} <Text style={{ color: Colors.primary, fontWeight: '800' }}>GescoPay</Text>
              </Text>
            </View>
          </Animated.View>

          {/* Actions */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.actionBtn, { minHeight: TOUCH_MIN }]}
              accessibilityLabel={T.qr.saveQR}
            >
              <Ionicons name="download-outline" size={20} color={Colors.primary} />
              <Text style={styles.actionBtnText}>{T.qr.saveQR}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnPrimary, { minHeight: TOUCH_MIN }]}
              onPress={() => Share.share({ message: `Pay ${CURRENT_USER.firstName} via GescoPay` })}
              accessibilityLabel={T.qr.shareQR}
            >
              <Ionicons name="share-outline" size={20} color="#FFF" />
              <Text style={[styles.actionBtnText, { color: '#FFF' }]}>{T.qr.shareQR}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, { minHeight: TOUCH_MIN }]}
              onPress={() => router.push('/(user)/qr/scan')}
              accessibilityLabel={T.qr.scanQR}
            >
              <Ionicons name="scan-outline" size={20} color={Colors.primary} />
              <Text style={styles.actionBtnText}>{T.qr.scanQR}</Text>
            </TouchableOpacity>
          </View>

          {/* Info card */}
          <View style={styles.infoCard}>
            <Ionicons name="shield-checkmark-outline" size={20} color={Colors.success} />
            <Text style={styles.infoText}>{T.qr.securityNote}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingTop: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: TS.h1, fontWeight: '800', color: Colors.navy },
  headerBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: `${Colors.success}15`, borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1, borderColor: `${Colors.success}30`,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.success },
  liveBadgeText: { fontSize: 12, fontWeight: '700', color: Colors.success },

  tabContainer: {
    flexDirection: 'row', backgroundColor: Colors.white,
    borderRadius: 12, padding: 4, marginBottom: 16, ...Shadows.sm,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabActive: { backgroundColor: Colors.primary },
  tabText: { fontSize: 14, fontWeight: '600', color: Colors.textMuted },
  tabTextActive: { color: '#FFF' },

  inlineAmounts: { marginBottom: 14 },
  inlineAmountsContent: { gap: 8, paddingRight: 4 },
  inlineAmountBtn: {
    height: 36, paddingHorizontal: 14,
    borderRadius: 18, backgroundColor: Colors.white,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1.5, borderColor: Colors.border,
  },
  inlineAmountBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  inlineAmountText: { fontSize: 13, fontWeight: '700', color: Colors.textSecondary },
  inlineAmountTextActive: { color: '#FFF' },

  qrCard: {
    backgroundColor: Colors.white, borderRadius: 24,
    overflow: 'hidden', marginBottom: 20, ...Shadows.lg,
  },
  qrTopBar: { padding: 20 },
  qrLogoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 4 },
  qrLogo: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  qrLogoText: { fontSize: 20, fontWeight: '800', color: '#FFF' },
  qrName: { fontSize: 16, fontWeight: '800', color: '#FFF' },
  qrPhone: { fontSize: 13, color: 'rgba(255,255,255,0.6)' },
  qrAmount: { marginTop: 10 },
  qrAmountLabel: { fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 2 },
  qrAmountValue: { fontSize: 24, fontWeight: '800', color: '#FFF' },

  qrCodeContainer: { padding: 24, alignItems: 'center', gap: 20 },
  qrCodeWrapper: {
    padding: 16, backgroundColor: '#FFF',
    borderRadius: 16, position: 'relative', overflow: 'hidden',
    ...Shadows.sm,
  },

  corner: { position: 'absolute', width: 28, height: 28, borderColor: Colors.primary, zIndex: 2 },
  cornerTL: { top: 4, left: 4, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 6 },
  cornerTR: { top: 4, right: 4, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 6 },
  cornerBL: { bottom: 4, left: 4, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 6 },
  cornerBR: { bottom: 4, right: 4, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 6 },

  scanLine: {
    position: 'absolute', left: 0, right: 0, height: 2,
    backgroundColor: Colors.primary, opacity: 0.5,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6, shadowRadius: 4,
  },

  walletsRow: { alignItems: 'center', gap: 8 },
  walletsLabel: { fontSize: 12, color: Colors.textMuted, fontWeight: '600' },
  walletChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  walletChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    borderRadius: 16, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1,
  },
  walletDot: { width: 6, height: 6, borderRadius: 3 },
  walletChipText: { fontSize: 12, fontWeight: '700' },

  qrBottom: {
    padding: 16, alignItems: 'center',
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  poweredBy: { fontSize: 12, color: Colors.textMuted },

  actionsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  actionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: Colors.white, borderRadius: 14, paddingVertical: 14,
    borderWidth: 1, borderColor: `${Colors.primary}30`, ...Shadows.sm,
  },
  actionBtnPrimary: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  actionBtnText: { fontSize: 13, fontWeight: '700', color: Colors.primary },

  infoCard: {
    flexDirection: 'row', gap: 10, padding: 16,
    borderRadius: 14, backgroundColor: `${Colors.success}08`,
    borderWidth: 1, borderColor: `${Colors.success}25`,
  },
  infoText: { flex: 1, fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },
});
