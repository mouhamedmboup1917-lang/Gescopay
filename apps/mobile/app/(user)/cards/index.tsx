import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Shadows } from '@/constants/Colors';
import { MOCK_CARD, MOCK_TRANSACTIONS } from '@/constants/mockData';
import { formatCurrency } from '@/lib/formatters';
import { T } from '@/constants/i18n';
import { PADDING_H, contentContainer, TS, TOUCH_MIN } from '@/constants/Responsive';

// ===== Toast component =====
function Toast({ visible, message }: { visible: boolean; message: string }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 20, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  return (
    <Animated.View style={[styles.toast, { opacity, transform: [{ translateY }] }]}>
      <Ionicons name="checkmark-circle" size={18} color={Colors.success} />
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
  );
}

export default function CardsScreen() {
  const insets = useSafeAreaInsets();
  const [isFrozen, setIsFrozen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [cardSettings, setCardSettings] = useState([true, false, true]);

  // ===== 3D FLIP ANIMATION =====
  const flipAnim = useRef(new Animated.Value(0)).current;
  const [isFlipped, setIsFlipped] = useState(false);

  const frontOpacity = flipAnim.interpolate({ inputRange: [0, 90, 180], outputRange: [1, 0, 0] });
  const backOpacity = flipAnim.interpolate({ inputRange: [0, 90, 180], outputRange: [0, 0, 1] });
  const frontRotateY = flipAnim.interpolate({ inputRange: [0, 180], outputRange: ['0deg', '180deg'] });
  const backRotateY = flipAnim.interpolate({ inputRange: [0, 180], outputRange: ['180deg', '360deg'] });

  const handleFlip = () => {
    const toValue = isFlipped ? 0 : 180;
    Animated.timing(flipAnim, {
      toValue,
      duration: 420,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
    setIsFlipped(!isFlipped);
  };

  // ===== SPENDING =====
  const spentPercentage = (MOCK_CARD.spentAmount / (MOCK_CARD.spendingLimit ?? 1)) * 100;
  const remaining = (MOCK_CARD.spendingLimit ?? 0) - MOCK_CARD.spentAmount;

  const getBarColors = (): [string, string] => {
    if (spentPercentage < 50) return ['#22C55E', '#16A34A'];
    if (spentPercentage < 80) return ['#F59E0B', '#D97706'];
    return ['#EF4444', '#DC2626'];
  };

  // ===== TOAST =====
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2200);
  };

  // ===== COPY =====
  const handleCopy = async () => {
    const cardNum = showDetails ? MOCK_CARD.cardNumber : MOCK_CARD.maskedNumber;
    if (Platform.OS !== 'web') {
      try {
        const Clipboard = require('@react-native-clipboard/clipboard').default;
        await Clipboard.setString(cardNum);
      } catch {}
    }
    showToast(T.card.copiedToast);
  };

  // ===== FREEZE =====
  const handleFreeze = () => {
    setIsFrozen(!isFrozen);
    showToast(isFrozen ? T.card.unfrozenToast : T.card.frozenToast);
  };

  // ===== CARD TRANSACTIONS =====
  const cardTxs = MOCK_TRANSACTIONS.filter((t) => t.type === 'payment').slice(0, 3);

  const cardSettingsConfig = [
    { label: T.card.onlinePayments, sublabel: T.card.onlinePaymentsSub, icon: 'globe-outline' },
    { label: T.card.internationalPayments, sublabel: T.card.internationalPaymentsSub, icon: 'airplane-outline' },
    { label: T.card.contactless, sublabel: T.card.contactlessSub, icon: 'wifi-outline' },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* ===== TOAST ===== */}
      <Toast visible={toastVisible} message={toastMessage} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
      >
        <View style={contentContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{T.card.title}</Text>
            <TouchableOpacity
              style={styles.addBtn}
              accessibilityLabel={T.card.addCard}
              accessibilityRole="button"
            >
              <Ionicons name="add" size={22} color={Colors.primary} />
            </TouchableOpacity>
          </View>

          {/* ===== GLASSMORPHISM CARD — 3D FLIP ===== */}
          <View style={styles.cardWrapper}>
            {/* Front face */}
            <Animated.View
              style={[
                styles.cardFace,
                {
                  opacity: frontOpacity,
                  transform: [{ perspective: 1200 }, { rotateY: frontRotateY }],
                },
              ]}
            >
              <TouchableOpacity activeOpacity={0.92} onPress={handleFlip}>
                <LinearGradient
                  colors={isFrozen ? ['#94A3B8', '#64748B'] : ['#143567', '#0A2342']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.card}
                >
                  <View style={styles.glassOverlay} />
                  <View style={styles.cardCircle1} />
                  <View style={styles.cardCircle2} />
                  <View style={styles.cardCircle3} />

                  <View style={styles.cardTopRow}>
                    <View style={styles.cardLogo}>
                      <Text style={styles.cardLogoText}>G</Text>
                    </View>
                    <View style={styles.cardLogoRight}>
                      {isFrozen && (
                        <View style={styles.frozenBadge}>
                          <Ionicons name="snow-outline" size={12} color="#FFF" />
                          <Text style={styles.frozenText}>{T.card.frozen}</Text>
                        </View>
                      )}
                    </View>
                  </View>

                  <View style={styles.cardChipRow}>
                    <View style={styles.chip}>
                      <View style={styles.chipLines}>
                        {[...Array(4)].map((_, i) => (
                          <View key={i} style={styles.chipLine} />
                        ))}
                      </View>
                    </View>
                    <View style={styles.nfcIcon}>
                      <Ionicons
                        name="wifi-outline"
                        size={20}
                        color="rgba(255,255,255,0.6)"
                        style={{ transform: [{ rotate: '90deg' }] }}
                      />
                    </View>
                  </View>

                  <Text style={styles.cardNumber}>
                    {showDetails ? MOCK_CARD.cardNumber : MOCK_CARD.maskedNumber}
                  </Text>

                  <View style={styles.cardFooter}>
                    <View>
                      <Text style={styles.cardFieldLabel}>{T.card.cardHolder}</Text>
                      <Text style={styles.cardFieldValue}>{MOCK_CARD.holderName}</Text>
                    </View>
                    <View>
                      <Text style={styles.cardFieldLabel}>{T.card.expires}</Text>
                      <Text style={styles.cardFieldValue}>
                        {String(MOCK_CARD.expiryMonth).padStart(2, '0')}/{MOCK_CARD.expiryYear}
                      </Text>
                    </View>
                    <View style={styles.visaContainer}>
                      <Text style={styles.visaText}>VISA</Text>
                    </View>
                  </View>

                  <Text style={styles.flipHintFront}>{T.card.flipHint}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {/* Back face */}
            <Animated.View
              style={[
                styles.cardFace,
                styles.cardFaceBack,
                {
                  opacity: backOpacity,
                  transform: [{ perspective: 1200 }, { rotateY: backRotateY }],
                },
              ]}
            >
              <TouchableOpacity activeOpacity={0.92} onPress={handleFlip}>
                <LinearGradient
                  colors={isFrozen ? ['#94A3B8', '#64748B'] : ['#143567', '#0A2342']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.card}
                >
                  <View style={styles.glassOverlay} />
                  <View style={styles.cardStripe} />
                  <View style={styles.cvvContainer}>
                    <Text style={styles.cvvLabel}>{T.card.cvvLabel}</Text>
                    <View style={styles.cvvBox}>
                      <Text style={styles.cvvValue}>{showDetails ? MOCK_CARD.cvv : '•••'}</Text>
                    </View>
                  </View>
                  <Text style={styles.flipHint}>{T.card.flipHint}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* Card actions */}
          <View style={styles.cardActions}>
            <TouchableOpacity
              style={[styles.cardAction, { minHeight: TOUCH_MIN }]}
              onPress={() => setShowDetails(!showDetails)}
              accessibilityLabel={showDetails ? T.card.hide : T.card.show}
            >
              <Ionicons
                name={showDetails ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={Colors.primary}
              />
              <Text style={styles.cardActionText}>{showDetails ? T.card.hide : T.card.show}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.cardAction, { minHeight: TOUCH_MIN }]}
              onPress={handleFreeze}
              accessibilityLabel={isFrozen ? T.card.unfreeze : T.card.freeze}
            >
              <Ionicons
                name={isFrozen ? 'flash-outline' : 'snow-outline'}
                size={20}
                color={isFrozen ? Colors.success : Colors.info}
              />
              <Text style={styles.cardActionText}>{isFrozen ? T.card.unfreeze : T.card.freeze}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.cardAction, { minHeight: TOUCH_MIN }]}
              onPress={handleCopy}
              accessibilityLabel={T.card.copy}
            >
              <Ionicons name="copy-outline" size={20} color={Colors.warning} />
              <Text style={styles.cardActionText}>{T.card.copy}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.cardAction, { minHeight: TOUCH_MIN }]}
              onPress={() => router.push('/(user)/cards/settings')}
              accessibilityLabel={T.card.settings}
            >
              <Ionicons name="settings-outline" size={20} color={Colors.mutedDark} />
              <Text style={styles.cardActionText}>{T.card.settings}</Text>
            </TouchableOpacity>
          </View>

          {/* ===== SPENDING LIMIT ===== */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{T.card.spendingLimit}</Text>
            <View style={styles.limitCard}>
              <View style={styles.limitRow}>
                <Text style={styles.limitSpent}>{formatCurrency(MOCK_CARD.spentAmount, 'XOF')}</Text>
                <Text style={styles.limitOf}>/ {formatCurrency(MOCK_CARD.spendingLimit ?? 0, 'XOF')}</Text>
              </View>
              <View style={styles.limitBarBg}>
                <LinearGradient
                  colors={getBarColors()}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.limitBarFill, { width: `${Math.min(spentPercentage, 100)}%` }]}
                />
              </View>
              <View style={styles.limitInfoRow}>
                <Text style={styles.limitPercent}>{T.card.usedThisMonth(Math.round(spentPercentage))}</Text>
                <Text
                  style={[
                    styles.limitRemaining,
                    { color: spentPercentage > 80 ? Colors.danger : Colors.success },
                  ]}
                >
                  {T.card.remaining}: {formatCurrency(remaining, 'XOF', true)}
                </Text>
              </View>
            </View>
          </View>

          {/* ===== CARD SETTINGS ===== */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{T.card.securitySettings}</Text>
            <View style={styles.settingsCard}>
              {cardSettingsConfig.map((setting, i) => (
                <View key={setting.label}>
                  <View style={styles.settingRow}>
                    <View style={[styles.settingIcon, { backgroundColor: `${Colors.primary}15` }]}>
                      <Ionicons name={setting.icon as any} size={18} color={Colors.primary} />
                    </View>
                    <View style={styles.settingInfo}>
                      <Text style={styles.settingLabel}>{setting.label}</Text>
                      <Text style={styles.settingSublabel}>{setting.sublabel}</Text>
                    </View>
                    <Switch
                      value={cardSettings[i]}
                      onValueChange={(v) => {
                        const next = [...cardSettings];
                        next[i] = v;
                        setCardSettings(next);
                        showToast(`${setting.label} ${v ? T.common.enabled : T.common.disabled} ✓`);
                      }}
                      trackColor={{ true: Colors.primary, false: Colors.border }}
                      thumbColor="#FFFFFF"
                      accessibilityLabel={setting.label}
                    />
                  </View>
                  {i < cardSettingsConfig.length - 1 && <View style={styles.settingDivider} />}
                </View>
              ))}
            </View>
          </View>

          {/* ===== RECENT CARD USAGE ===== */}
          {cardTxs.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{T.card.recentUsage}</Text>
                <TouchableOpacity onPress={() => router.push('/(user)/transactions/index')}>
                  <Text style={styles.seeAll}>{T.common.seeAll}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.settingsCard}>
                {cardTxs.map((tx, i) => (
                  <View key={tx.id}>
                    <View style={styles.txRow}>
                      <View style={[styles.txIcon, { backgroundColor: `${Colors.orange}15` }]}>
                        <Ionicons name="cart-outline" size={18} color={Colors.orange} />
                      </View>
                      <View style={styles.txInfo}>
                        <Text style={styles.txName} numberOfLines={1}>
                          {tx.merchantName ?? tx.description}
                        </Text>
                        <Text style={styles.txMeta}>
                          {new Date(tx.createdAt).toLocaleDateString('en-US', {
                            day: '2-digit',
                            month: 'short',
                          })}{' '}
                          ·{' '}
                          {new Date(tx.createdAt).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Text>
                      </View>
                      <Text style={styles.txAmount}>-{formatCurrency(tx.amount, 'XOF', true)}</Text>
                    </View>
                    {i < cardTxs.length - 1 && <View style={styles.settingDivider} />}
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Security note */}
          <View
            style={[
              styles.infoCard,
              { backgroundColor: `${Colors.primary}10`, borderColor: `${Colors.primary}30` },
            ]}
          >
            <Ionicons name="shield-checkmark-outline" size={20} color={Colors.primary} />
            <Text style={styles.infoText}>{T.card.securityNote}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingTop: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: TS.h1, fontWeight: '800', color: Colors.navy },
  addBtn: {
    width: TOUCH_MIN,
    height: TOUCH_MIN,
    borderRadius: 12,
    backgroundColor: `${Colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ===== 3D CARD FLIP =====
  cardWrapper: { marginBottom: 16, height: 220 },
  cardFace: {
    position: 'absolute',
    width: '100%',
    backfaceVisibility: 'hidden',
  },
  cardFaceBack: { top: 0 },

  card: {
    height: 220,
    borderRadius: 24,
    padding: 24,
    justifyContent: 'space-between',
    overflow: 'hidden',
    ...Shadows.card,
  },
  glassOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cardCircle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.04)',
    top: -80,
    right: -60,
  },
  cardCircle2: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(0,168,168,0.1)',
    bottom: -50,
    left: 30,
  },
  cardCircle3: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,122,0,0.08)',
    top: 30,
    right: 60,
  },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardLogo: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLogoText: { fontSize: 18, fontWeight: '800', color: '#FFF' },
  cardLogoRight: { flexDirection: 'row', gap: 8 },
  frozenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(100,116,139,0.6)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  frozenText: { fontSize: 10, color: '#FFF', fontWeight: '700' },
  cardChipRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  chip: {
    width: 36,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#D4A017',
    padding: 4,
    justifyContent: 'space-between',
  },
  chipLines: { gap: 2 },
  chipLine: { height: 1.5, backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: 1 },
  nfcIcon: {},
  cardNumber: { fontSize: 18, fontWeight: '700', color: '#FFF', letterSpacing: 4 },
  cardFooter: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  cardFieldLabel: { fontSize: TS.sm, color: 'rgba(255,255,255,0.5)', letterSpacing: 1, marginBottom: 3 },
  cardFieldValue: { fontSize: 13, fontWeight: '700', color: '#FFF' },
  visaContainer: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  visaText: { fontSize: 16, fontWeight: '900', color: '#FFF', fontStyle: 'italic' },
  flipHintFront: {
    position: 'absolute',
    bottom: 12,
    right: 16,
    color: 'rgba(255,255,255,0.3)',
    fontSize: 10,
  },

  // Back face
  cardStripe: { height: 40, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 4, marginTop: 20 },
  cvvContainer: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 20 },
  cvvLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: '600' },
  cvvBox: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 6,
    padding: 8,
    alignItems: 'center',
  },
  cvvValue: { fontSize: 16, fontWeight: '700', color: Colors.navy, letterSpacing: 6 },
  flipHint: { textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 20 },

  // Card actions
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
    ...Shadows.md,
  },
  cardAction: { alignItems: 'center', justifyContent: 'center', gap: 6, flex: 1 },
  cardActionText: { fontSize: 11, fontWeight: '600', color: Colors.textSecondary },

  // Section
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: TS.h2, fontWeight: '800', color: Colors.navy, marginBottom: 12 },
  seeAll: { fontSize: 14, fontWeight: '600', color: Colors.primary },

  // Limit
  limitCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    gap: 12,
    ...Shadows.md,
  },
  limitRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  limitSpent: { fontSize: 22, fontWeight: '800', color: Colors.navy },
  limitOf: { fontSize: 15, color: Colors.muted },
  limitBarBg: { height: 10, backgroundColor: Colors.border, borderRadius: 5, overflow: 'hidden' },
  limitBarFill: { height: '100%', borderRadius: 5 },
  limitInfoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  limitPercent: { fontSize: 13, color: Colors.textSecondary },
  limitRemaining: { fontSize: 13, fontWeight: '700' },

  // Settings
  settingsCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 4,
    ...Shadows.md,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingInfo: { flex: 1 },
  settingLabel: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  settingSublabel: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  settingDivider: { height: 1, backgroundColor: Colors.border, marginHorizontal: 16 },

  // Recent usage
  txRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
  txIcon: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  txInfo: { flex: 1, gap: 3 },
  txName: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  txMeta: { fontSize: 12, color: Colors.textMuted },
  txAmount: { fontSize: 14, fontWeight: '800', color: Colors.textPrimary },

  // Info
  infoCard: {
    flexDirection: 'row',
    gap: 10,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 24,
  },
  infoText: { flex: 1, fontSize: 13, color: Colors.textSecondary, lineHeight: 20 },

  // Toast
  toast: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.navy,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    zIndex: 999,
    ...Shadows.lg,
  },
  toastText: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
});
