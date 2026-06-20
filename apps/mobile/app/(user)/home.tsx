import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Platform,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/authStore';
import { useWalletStore } from '@/store/walletStore';
import { useUIStore } from '@/store/uiStore';
import { MOCK_TRANSACTIONS, SPENDING_CATEGORIES } from '@/constants/mockData';
import { Colors, Shadows } from '@/constants/Colors';
import { formatCurrency } from '@/lib/formatters';
import { T, getGreeting } from '@/constants/i18n';
import {
  SW, PADDING_H, TS, TOUCH_MIN, TOUCH_SM, isTablet, isDesktop, colWidth, contentContainer, CARD_W,
} from '@/constants/Responsive';

const QUICK_ACTIONS = [
  { id: 'scan',     icon: 'scan-outline',             label: T.actions.scan,     color: Colors.primary,   route: '/(user)/qr/scan' },
  { id: 'pay',      icon: 'send-outline',              label: T.actions.pay,      color: '#FF7A00',        route: '/(user)/transfer/index' },
  { id: 'receive',  icon: 'download-outline',          label: T.actions.receive,  color: Colors.success,   route: '/(user)/qr/display' },
  { id: 'transfer', icon: 'swap-horizontal-outline',   label: T.actions.transfer, color: '#3B82F6',        route: '/(user)/transfer/index' },
  { id: 'card',     icon: 'card-outline',              label: T.actions.card,     color: '#8B5CF6',        route: '/(user)/cards' },
  { id: 'wallets',  icon: 'wallet-outline',            label: T.actions.wallets,  color: '#EC4899',        route: '/(user)/wallets/index' },
  { id: 'topup',    icon: 'add-circle-outline',        label: T.actions.topUp,    color: Colors.warning,   route: '/(user)/wallets/add' },
  { id: 'more',     icon: 'grid-outline',              label: T.actions.more,     color: Colors.mutedDark, route: null },
];

// Responsive quick action column count: 4 on phone, 8 on tablet
const QA_COLS = isTablet ? 8 : 4;
const QA_ICON_SIZE = isTablet ? 60 : 56;
const QA_ICON_W = colWidth(QA_COLS, 10);

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;
  const { user } = useAuthStore();
  const { wallets, totalBalance } = useWalletStore();
  const { isBalanceHidden, toggleBalanceVisibility } = useUIStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [syncTime, setSyncTime] = useState(T.home.justNow);
  const syncRotation = useRef(new Animated.Value(0)).current;

  // Dynamic Card Aspect Ratio & Height for preview
  const cardPreviewHeight = Math.min(180, Math.round(CARD_W / 1.9));
  const cardPreviewPadding = Math.round(cardPreviewHeight * 0.12);
  const cardPreviewFontSize = Math.round(cardPreviewHeight * 0.095);

  const recentTx = MOCK_TRANSACTIONS.slice(0, isTablet ? 10 : 8);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const animateSyncIcon = useCallback(() => {
    syncRotation.setValue(0);
    Animated.timing(syncRotation, { toValue: 1, duration: 800, useNativeDriver: true }).start();
  }, [syncRotation]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    animateSyncIcon();
    await new Promise((r) => setTimeout(r, 1400));
    setSyncTime(T.home.justNow);
    setIsRefreshing(false);
  }, [animateSyncIcon]);

  const handleSyncPress = useCallback(() => {
    animateSyncIcon();
    setSyncTime(T.home.justNow);
  }, [animateSyncIcon]);

  const syncRotateDeg = syncRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Sticky header */}
      <Animated.View style={[styles.stickyHeader, { opacity: headerOpacity }]}>
        <Text style={styles.stickyTitle}>{T.appName}</Text>
      </Animated.View>

      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 110 },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
      >
        {/* ── HEADER ── */}
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName} numberOfLines={1}>
              {user?.firstName} {user?.lastName}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.iconBtn}
              accessibilityLabel={T.home.notifications}
              accessibilityRole="button"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="notifications-outline" size={22} color={Colors.navy} />
              <View style={styles.notifBadge} />
            </TouchableOpacity>
            <View style={styles.avatar} accessibilityLabel={`${user?.firstName} ${user?.lastName}`}>
              <Text style={styles.avatarText}>
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </Text>
            </View>
          </View>
        </View>

        {/* ── BALANCE CARD ── */}
        <View style={styles.balanceCardWrapper}>
          <LinearGradient
            colors={['#0A2342', '#1A3A6B', '#00A8A8']}
            locations={[0, 0.6, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.balanceCard}
          >
            <View style={styles.blob1} />
            <View style={styles.blob2} />

            <View style={styles.balanceTop}>
              <View style={styles.balanceLabelRow}>
                <Text style={styles.balanceLabel}>{T.home.totalBalance}</Text>
                <TouchableOpacity
                  onPress={toggleBalanceVisibility}
                  accessibilityLabel={isBalanceHidden ? T.home.showBalance : T.home.hideBalance}
                  accessibilityRole="button"
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons
                    name={isBalanceHidden ? 'eye-off-outline' : 'eye-outline'}
                    size={18}
                    color="rgba(255,255,255,0.65)"
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.balanceAmount} accessibilityLabel={isBalanceHidden ? 'Balance hidden' : `Balance: ${formatCurrency(totalBalance, 'XOF')}`}>
                {isBalanceHidden ? T.home.hiddenBalance : formatCurrency(totalBalance, 'XOF')}
              </Text>
              <View style={styles.balanceCurrencyRow}>
                <Text style={styles.balanceCurrency}>
                  XOF · {T.home.walletsConnected(wallets.length)}
                </Text>
                <TouchableOpacity
                  onPress={handleSyncPress}
                  style={styles.syncBtn}
                  accessibilityLabel="Refresh balance"
                  accessibilityRole="button"
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Animated.View style={{ transform: [{ rotate: syncRotateDeg }] }}>
                    <Ionicons name="refresh-outline" size={13} color="rgba(255,255,255,0.45)" />
                  </Animated.View>
                  <Text style={styles.syncText}>{T.home.lastSync} {syncTime}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Wallet chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.walletChips}
              contentContainerStyle={{ gap: 8, paddingHorizontal: 24 }}
              accessibilityLabel="Connected wallets"
            >
              {wallets.map((wallet, idx) => (
                <TouchableOpacity
                  key={wallet.id}
                  style={[styles.walletChip, { borderColor: `${wallet.providerInfo.color}70` }]}
                  activeOpacity={0.75}
                  accessibilityLabel={`${wallet.providerInfo.shortName} wallet, balance ${wallet.balance}`}
                >
                  <View style={[styles.walletStatusDot, { backgroundColor: wallet.isActive ? Colors.success : Colors.muted }]} />
                  <Text style={styles.walletChipName}>{wallet.providerInfo.shortName}</Text>
                  <Text style={styles.walletChipBal}>
                    {isBalanceHidden ? T.home.hiddenShort : formatCurrency(wallet.balance, 'XOF', true)}
                  </Text>
                  {idx === 0 && (
                    <View style={styles.walletPrincipalBadge}>
                      <Text style={styles.walletPrincipalText}>{T.home.principal}</Text>
                    </View>
                  )}
                  <Ionicons name="chevron-forward" size={10} color="rgba(255,255,255,0.4)" />
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Sent / Received stats */}
            <View style={styles.balanceStats}>
              <View style={styles.balanceStat}>
                <View style={styles.balanceStatIconRed}>
                  <Ionicons name="arrow-up" size={14} color={Colors.danger} />
                </View>
                <View>
                  <Text style={styles.balanceStatLabel}>{T.home.sentThisMonth}</Text>
                  <Text style={styles.balanceStatValue}>
                    {isBalanceHidden ? T.home.hiddenShort : '245,000 F'}
                  </Text>
                </View>
              </View>
              <View style={styles.balanceStatDivider} />
              <View style={styles.balanceStat}>
                <View style={styles.balanceStatIconGreen}>
                  <Ionicons name="arrow-down" size={14} color={Colors.success} />
                </View>
                <View>
                  <Text style={styles.balanceStatLabel}>{T.home.receivedThisMonth}</Text>
                  <Text style={styles.balanceStatValue}>
                    {isBalanceHidden ? T.home.hiddenShort : '512,000 F'}
                  </Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* ── QUICK ACTIONS ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{T.home.quickActions}</Text>
          <View style={[styles.quickActionsGrid, isTablet && styles.quickActionsGridTablet]}>
            {QUICK_ACTIONS.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[styles.quickAction, { width: QA_ICON_W }]}
                onPress={() => action.route && router.push(action.route as any)}
                accessibilityLabel={action.label}
                accessibilityRole="button"
                hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: `${action.color}15`, width: QA_ICON_W, height: QA_ICON_W }]}>
                  <Ionicons name={action.icon as any} size={24} color={action.color} />
                </View>
                <Text style={styles.quickActionLabel} numberOfLines={1} adjustsFontSizeToFit>
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── UNIVERSAL QR BANNER ── */}
        <View style={styles.qrBannerWrapper}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push('/(user)/qr/display')}
            accessibilityLabel="Universal QR Code"
            accessibilityRole="button"
          >
            <LinearGradient
              colors={['#00A8A8', '#1A3A6B']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.qrBanner}
            >
              <View style={styles.qrBannerLeft}>
                <View style={styles.qrBannerIcon}>
                  <Ionicons name="qr-code-outline" size={24} color="#FFFFFF" />
                </View>
                <View style={styles.qrBannerText}>
                  <Text style={styles.qrBannerTitle}>{T.home.receiveViaQR}</Text>
                  <Text style={styles.qrBannerSub} numberOfLines={1} adjustsFontSizeToFit>{T.home.receiveViaQRSub}</Text>
                </View>
              </View>
              <View style={styles.qrBannerArrow}>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* ── VIRTUAL CARD PREVIEW ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{T.home.virtualCard}</Text>
            <TouchableOpacity onPress={() => router.push('/(user)/cards')}>
              <Text style={styles.seeAll}>{T.common.manage}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => router.push('/(user)/cards')}
            accessibilityLabel="My Visa Virtual Card"
            accessibilityRole="button"
          >
            <LinearGradient
              colors={['#143567', '#0A2342']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.cardPreview, { height: cardPreviewHeight, padding: cardPreviewPadding }]}
            >
              <View style={styles.cardChip}>
                <View style={styles.chipInner} />
              </View>
              <View style={styles.cardContent}>
                <Text style={[styles.cardNumber, { fontSize: cardPreviewFontSize }]}>4532 •••• •••• 9012</Text>
                <View style={styles.cardBottom}>
                  <View>
                    <Text style={styles.cardFieldLabel}>{T.card.cardHolder}</Text>
                    <Text style={styles.cardFieldValue}>AMADOU DIALLO</Text>
                  </View>
                  <View>
                    <Text style={styles.cardFieldLabel}>{T.card.expires}</Text>
                    <Text style={styles.cardFieldValue}>03/27</Text>
                  </View>
                  <View style={styles.visaLogo}>
                    <Text style={styles.visaText}>VISA</Text>
                  </View>
                </View>
              </View>
              <View style={styles.cardCircle1} />
              <View style={styles.cardCircle2} />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* ── SPENDING OVERVIEW ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{T.home.spendingOverview}</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>{T.common.details}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.spendingCard}>
            <View style={styles.spendingBar}>
              {SPENDING_CATEGORIES.map((cat, i) => (
                <View
                  key={cat.name}
                  style={[styles.spendingSegment, {
                    flex: cat.percentage,
                    backgroundColor: cat.color,
                    borderTopLeftRadius: i === 0 ? 8 : 0,
                    borderBottomLeftRadius: i === 0 ? 8 : 0,
                    borderTopRightRadius: i === SPENDING_CATEGORIES.length - 1 ? 8 : 0,
                    borderBottomRightRadius: i === SPENDING_CATEGORIES.length - 1 ? 8 : 0,
                  }]}
                />
              ))}
            </View>
            <View style={styles.spendingLegend}>
              {SPENDING_CATEGORIES.slice(0, 4).map((cat) => (
                <View key={cat.name} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: cat.color }]} />
                  <Text style={styles.legendLabel}>{cat.name}</Text>
                  <Text style={styles.legendValue}>{cat.percentage}%</Text>
                </View>
              ))}
            </View>
            <Text style={styles.spendingTotal}>
              Total: <Text style={{ color: Colors.navy, fontWeight: '700' }}>250,000 F XOF</Text>
            </Text>
          </View>
        </View>

        {/* ── RECENT TRANSACTIONS ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{T.home.recentTransactions}</Text>
            <TouchableOpacity onPress={() => router.push('/(user)/transactions/index')}>
              <Text style={styles.seeAll}>{T.common.seeAll}</Text>
            </TouchableOpacity>
          </View>
          {recentTx.map((tx) => (
            <TouchableOpacity
              key={tx.id}
              style={styles.txRow}
              onPress={() => router.push(`/(user)/transactions/${tx.id}` as any)}
              activeOpacity={0.7}
              accessibilityLabel={`${tx.merchantName ?? tx.description}, ${tx.amount}`}
            >
              <View style={[styles.txIcon, { backgroundColor: getTxColor(tx.type) + '15' }]}>
                <Ionicons name={getTxIcon(tx.type)} size={20} color={getTxColor(tx.type)} />
              </View>
              <View style={styles.txInfo}>
                <Text style={styles.txName} numberOfLines={1}>
                  {tx.merchantName ?? tx.description}
                </Text>
                <Text style={styles.txDate}>{formatDate(tx.createdAt)}</Text>
              </View>
              <View style={styles.txRight}>
                <Text style={[styles.txAmount, { color: isCredit(tx.type) ? Colors.success : Colors.textPrimary }]}>
                  {isCredit(tx.type) ? '+' : '–'}{formatCurrency(tx.amount, 'XOF', true)}
                </Text>
                <View style={[styles.txStatus, { backgroundColor: getStatusColor(tx.status) + '15' }]}>
                  <Text style={[styles.txStatusText, { color: getStatusColor(tx.status) }]}>
                    {getStatusLabel(tx.status)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.ScrollView>
    </View>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────────
const isCredit = (t: string) => ['receive', 'top_up', 'refund'].includes(t);

function getTxIcon(type: string): any {
  return ({
    send: 'arrow-up-circle-outline', receive: 'arrow-down-circle-outline',
    payment: 'cart-outline', top_up: 'add-circle-outline',
    withdrawal: 'cash-outline', refund: 'refresh-circle-outline',
  } as any)[type] ?? 'ellipse-outline';
}

function getTxColor(type: string): string {
  return ({
    send: Colors.danger, receive: Colors.success, payment: Colors.orange,
    top_up: Colors.primary, withdrawal: Colors.warning, refund: Colors.info,
  } as any)[type] ?? Colors.muted;
}

function getStatusColor(status: string): string {
  return ({
    completed: Colors.success, pending: Colors.warning, processing: Colors.info,
    failed: Colors.danger, cancelled: Colors.muted, refunded: Colors.primary,
  } as any)[status] ?? Colors.muted;
}

function getStatusLabel(status: string): string {
  return (T.transactions.status as any)[status] ?? status;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  stickyHeader: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
    backgroundColor: Colors.background, paddingHorizontal: PADDING_H,
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  stickyTitle: { fontSize: TS.h2, fontWeight: '800', color: Colors.navy },
  scrollContent: { paddingHorizontal: PADDING_H, paddingTop: 12 },

  // Header
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerLeft: { flex: 1, marginRight: 12 },
  greeting: { fontSize: TS.sm, color: Colors.textSecondary, marginBottom: 2 },
  userName: { fontSize: TS.h1, fontWeight: '800', color: Colors.navy },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBtn: {
    width: TOUCH_MIN, height: TOUCH_MIN, borderRadius: 12,
    backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center', ...Shadows.sm,
  },
  notifBadge: {
    position: 'absolute', top: 8, right: 8, width: 8, height: 8,
    borderRadius: 4, backgroundColor: Colors.danger, borderWidth: 1.5, borderColor: Colors.white,
  },
  avatar: {
    width: TOUCH_MIN, height: TOUCH_MIN, borderRadius: 12,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 15, fontWeight: '800', color: '#FFF' },

  // Balance card
  balanceCardWrapper: { marginBottom: 24 },
  balanceCard: { borderRadius: 24, padding: 24, overflow: 'hidden', ...Shadows.card },
  blob1: { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(0,168,168,0.15)', top: -60, right: -60 },
  blob2: { position: 'absolute', width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(255,122,0,0.08)', bottom: -40, left: -40 },
  balanceTop: { marginBottom: 20 },
  balanceLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  balanceLabel: { fontSize: TS.sm, color: 'rgba(255,255,255,0.6)', fontWeight: '500' },
  balanceAmount: { fontSize: TS.hero, fontWeight: '800', color: '#FFFFFF', letterSpacing: -1.5, marginBottom: 6 },
  balanceCurrencyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  balanceCurrency: { fontSize: TS.xs, color: 'rgba(255,255,255,0.5)' },
  syncBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  syncText: { fontSize: 11, color: 'rgba(255,255,255,0.38)', fontWeight: '500' },

  // Wallet chips
  walletChips: { marginBottom: 20, marginHorizontal: -24 },
  walletChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(255,255,255,0.16)', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, minWidth: 90,
    minHeight: TOUCH_SM,
  },
  walletStatusDot: { width: 7, height: 7, borderRadius: 3.5 },
  walletChipName: { fontSize: TS.xs, color: 'rgba(255,255,255,0.85)', fontWeight: '600' },
  walletChipBal: { fontSize: TS.xs, color: '#FFFFFF', fontWeight: '700', flex: 1 },
  walletPrincipalBadge: { backgroundColor: 'rgba(255,122,0,0.75)', borderRadius: 6, paddingHorizontal: 5, paddingVertical: 2 },
  walletPrincipalText: { fontSize: 9, color: '#FFF', fontWeight: '800', letterSpacing: 0.3 },

  // Balance stats
  balanceStats: {
    flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16, padding: 16, alignItems: 'center',
  },
  balanceStat: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  balanceStatIconRed: { width: 32, height: 32, borderRadius: 8, backgroundColor: 'rgba(239,68,68,0.2)', alignItems: 'center', justifyContent: 'center' },
  balanceStatIconGreen: { width: 32, height: 32, borderRadius: 8, backgroundColor: 'rgba(34,197,94,0.2)', alignItems: 'center', justifyContent: 'center' },
  balanceStatLabel: { fontSize: TS.xs, color: 'rgba(255,255,255,0.55)', marginBottom: 2 },
  balanceStatValue: { fontSize: TS.body, fontWeight: '700', color: '#FFFFFF' },
  balanceStatDivider: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.12)', marginHorizontal: 16 },

  // Sections
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: TS.h3, fontWeight: '700', color: Colors.navy },
  seeAll: { fontSize: TS.body, fontWeight: '600', color: Colors.primary },

  // Quick actions
  quickActionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  quickActionsGridTablet: { justifyContent: 'space-between' },
  quickAction: { alignItems: 'center', gap: 8 },
  quickActionIcon: { borderRadius: 16, alignItems: 'center', justifyContent: 'center', ...Shadows.sm },
  quickActionLabel: { fontSize: TS.xs, fontWeight: '600', color: Colors.textSecondary, textAlign: 'center' },

  // QR Banner
  qrBannerWrapper: { marginBottom: 24 },
  qrBanner: { borderRadius: 18, paddingHorizontal: 20, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', ...Shadows.card },
  qrBannerLeft: { flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 },
  qrBannerIcon: { width: TOUCH_MIN, height: TOUCH_MIN, borderRadius: 14, backgroundColor: 'rgba(0,168,168,0.3)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(0,168,168,0.5)' },
  qrBannerText: { flex: 1 },
  qrBannerTitle: { fontSize: TS.h3, fontWeight: '700', color: '#FFFFFF', marginBottom: 3 },
  qrBannerSub: { fontSize: TS.xs, color: 'rgba(255,255,255,0.5)', fontWeight: '500' },
  qrBannerArrow: { width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(0,168,168,0.15)', alignItems: 'center', justifyContent: 'center' },

  // Card preview
  cardPreview: { height: 180, borderRadius: 20, padding: 24, justifyContent: 'space-between', overflow: 'hidden', ...Shadows.card },
  cardChip: { width: 36, height: 28, borderRadius: 6, backgroundColor: '#D4A017', overflow: 'hidden', justifyContent: 'center' },
  chipInner: { width: '100%', height: 1, backgroundColor: 'rgba(0,0,0,0.2)', marginTop: 9 },
  cardContent: { gap: 16 },
  cardNumber: { fontSize: 17, fontWeight: '700', color: '#FFFFFF', letterSpacing: 2 },
  cardBottom: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  cardFieldLabel: { fontSize: TS.xs, color: 'rgba(255,255,255,0.5)', letterSpacing: 1, marginBottom: 2 },
  cardFieldValue: { fontSize: TS.sm, fontWeight: '700', color: '#FFFFFF' },
  visaLogo: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
  visaText: { fontSize: 16, fontWeight: '900', color: '#FFFFFF', fontStyle: 'italic' },
  cardCircle1: { position: 'absolute', width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(255,255,255,0.04)', top: -60, right: -60 },
  cardCircle2: { position: 'absolute', width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(0,168,168,0.12)', bottom: -30, left: 40 },

  // Spending
  spendingCard: { backgroundColor: Colors.white, borderRadius: 20, padding: 20, ...Shadows.md },
  spendingBar: { flexDirection: 'row', height: 14, borderRadius: 8, overflow: 'hidden', marginBottom: 16, gap: 2 },
  spendingSegment: { height: '100%' },
  spendingLegend: { gap: 10, marginBottom: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: { flex: 1, fontSize: TS.body, color: Colors.textSecondary },
  legendValue: { fontSize: TS.body, fontWeight: '700', color: Colors.textPrimary },
  spendingTotal: { fontSize: TS.sm, color: Colors.textSecondary, borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 12 },

  // Transactions
  txRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.white, borderRadius: 16, padding: 16, marginBottom: 8, ...Shadows.sm },
  txIcon: { width: TOUCH_MIN, height: TOUCH_MIN, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  txInfo: { flex: 1, gap: 4, marginRight: 8 },
  txName: { fontSize: TS.body, fontWeight: '700', color: Colors.textPrimary },
  txDate: { fontSize: TS.xs, color: Colors.textMuted },
  txRight: { alignItems: 'flex-end', gap: 4 },
  txAmount: { fontSize: 15, fontWeight: '800' },
  txStatus: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  txStatusText: { fontSize: 11, fontWeight: '700' },
});
