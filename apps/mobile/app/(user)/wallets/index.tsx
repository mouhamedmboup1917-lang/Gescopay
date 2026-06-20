import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Shadows } from '@/constants/Colors';
import { MOCK_WALLETS, WALLET_PROVIDERS } from '@/constants/mockData';
import { useWalletStore } from '@/store/walletStore';
import { formatCurrency } from '@/lib/formatters';
import { T } from '@/constants/i18n';
import { PADDING_H, TS, TOUCH_MIN, TOUCH_SM, isTablet } from '@/constants/Responsive';

export default function WalletsScreen() {
  const insets = useSafeAreaInsets();
  const { wallets, syncWallets } = useWalletStore();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await syncWallets();
    setRefreshing(false);
  };

  const totalBalance = wallets.reduce((s, w) => s + w.balance, 0);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 110 }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{T.wallets.title}</Text>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => router.push('/(user)/wallets/add' as any)}
            accessibilityLabel={T.wallets.addWallet}
            accessibilityRole="button"
          >
            <Ionicons name="add" size={22} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Total balance card */}
        <LinearGradient
          colors={['#0A2342', '#00A8A8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.totalCard}
        >
          <View style={styles.totalCardBlob} />
          <Text style={styles.totalLabel}>{T.wallets.totalBalance}</Text>
          <Text style={styles.totalAmount}>{formatCurrency(totalBalance, 'XOF')}</Text>
          <View style={styles.totalMeta}>
            <View style={styles.totalMetaDot} />
            <Text style={styles.totalSub}>{T.wallets.walletsCount(wallets.length)}</Text>
          </View>
        </LinearGradient>

        {/* Connected wallets */}
        <Text style={styles.sectionTitle}>{T.wallets.connectedWallets}</Text>
        {wallets.map((wallet) => (
          <View key={wallet.id} style={styles.walletCard}>
            <View style={[styles.walletColorBar, { backgroundColor: wallet.providerInfo.color }]} />
            <View style={styles.walletContent}>
              {/* Header row */}
              <View style={styles.walletHeader}>
                <View style={styles.walletLeft}>
                  <View style={[styles.walletProviderBadge, { backgroundColor: `${wallet.providerInfo.color}18` }]}>
                    <View style={[styles.walletProviderDot, { backgroundColor: wallet.providerInfo.color }]} />
                    <Text style={[styles.walletProviderName, { color: wallet.providerInfo.color }]}>
                      {wallet.providerInfo.name}
                    </Text>
                  </View>
                  {wallet.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultText}>{T.wallets.primary}</Text>
                    </View>
                  )}
                </View>
                {/* Connection status */}
                <View style={styles.statusRow}>
                  <View style={[styles.statusDot, { backgroundColor: wallet.isActive ? Colors.success : Colors.danger }]} />
                  <Text style={[styles.statusLabel, { color: wallet.isActive ? Colors.success : Colors.danger }]}>
                    {wallet.isActive ? T.wallets.connected : T.wallets.disconnected}
                  </Text>
                </View>
              </View>

              <Text style={styles.walletPhone}>{wallet.phoneNumber}</Text>
              {wallet.alias && wallet.alias !== wallet.providerInfo.name && (
                <Text style={styles.walletAlias}>{wallet.alias}</Text>
              )}

              {/* Balance + actions */}
              <View style={styles.walletFooter}>
                <View>
                  <Text style={styles.walletBalLabel}>{T.wallets.balance}</Text>
                  <Text style={styles.walletBalance}>{formatCurrency(wallet.balance, wallet.currency)}</Text>
                </View>
                <View style={styles.walletActions}>
                  <TouchableOpacity
                    style={styles.walletActionBtn}
                    accessibilityLabel={`${T.wallets.syncNow} ${wallet.providerInfo.shortName}`}
                  >
                    <Ionicons name="refresh-outline" size={16} color={Colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.walletActionBtn}
                    accessibilityLabel={`${T.wallets.send} from ${wallet.providerInfo.shortName}`}
                  >
                    <Ionicons name="send-outline" size={16} color={Colors.orange} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.walletActionBtn}>
                    <Ionicons name="ellipsis-horizontal" size={16} color={Colors.muted} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ))}

        {/* Add wallet section */}
        <Text style={styles.sectionTitle}>{T.wallets.connectNew}</Text>
        <View style={[styles.providersGrid, isTablet && styles.providersGridTablet]}>
          {WALLET_PROVIDERS.filter((p) => !wallets.find((w) => w.provider === p.id)).map((provider) => (
            <TouchableOpacity
              key={provider.id}
              style={styles.providerCard}
              onPress={() => router.push('/(user)/wallets/add' as any)}
              accessibilityLabel={`Connect ${provider.shortName}`}
              accessibilityRole="button"
            >
              <View style={[styles.providerIcon, { backgroundColor: `${provider.color}15` }]}>
                <View style={[styles.providerDot, { backgroundColor: provider.color }]} />
              </View>
              <Text style={styles.providerName}>{provider.shortName}</Text>
              <Ionicons name="add" size={16} color={Colors.primary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Sync hint */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={18} color={Colors.primary} />
          <Text style={styles.infoText}>{T.wallets.syncHint}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: PADDING_H, paddingTop: 12 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: TS.h1, fontWeight: '800', color: Colors.navy },
  addBtn: {
    width: TOUCH_MIN, height: TOUCH_MIN, borderRadius: 12,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', ...Shadows.primary,
  },

  totalCard: { borderRadius: 22, padding: 24, marginBottom: 28, ...Shadows.card, overflow: 'hidden' },
  totalCardBlob: {
    position: 'absolute', width: 180, height: 180, borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.06)', top: -60, right: -40,
  },
  totalLabel: { fontSize: TS.sm, color: 'rgba(255,255,255,0.6)', marginBottom: 8, fontWeight: '500' },
  totalAmount: { fontSize: 36, fontWeight: '800', color: '#FFF', marginBottom: 10, letterSpacing: -1 },
  totalMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  totalMetaDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: Colors.success },
  totalSub: { fontSize: TS.sm, color: 'rgba(255,255,255,0.55)' },

  sectionTitle: { fontSize: TS.h3, fontWeight: '800', color: Colors.navy, marginBottom: 14 },

  // Wallet card
  walletCard: {
    flexDirection: 'row', backgroundColor: Colors.white, borderRadius: 20,
    overflow: 'hidden', marginBottom: 14, ...Shadows.md,
    minHeight: TOUCH_MIN * 2,
  },
  walletColorBar: { width: 5 },
  walletContent: { flex: 1, padding: 16 },
  walletHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  walletLeft: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  walletProviderBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  walletProviderDot: { width: 6, height: 6, borderRadius: 3 },
  walletProviderName: { fontSize: TS.sm, fontWeight: '700' },
  defaultBadge: { backgroundColor: `${Colors.primary}15`, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  defaultText: { fontSize: 11, fontWeight: '700', color: Colors.primary },
  // Status indicator with label
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  statusDot: { width: 7, height: 7, borderRadius: 3.5 },
  statusLabel: { fontSize: 11, fontWeight: '600' },

  walletPhone: { fontSize: TS.body, color: Colors.textSecondary, marginBottom: 2 },
  walletAlias: { fontSize: TS.sm, color: Colors.textMuted, marginBottom: 8 },
  walletFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 12 },
  walletBalLabel: { fontSize: 11, color: Colors.textMuted, marginBottom: 2 },
  walletBalance: { fontSize: 20, fontWeight: '800', color: Colors.navy },
  walletActions: { flexDirection: 'row', gap: 8 },
  walletActionBtn: {
    width: TOUCH_SM, height: TOUCH_SM, borderRadius: 10,
    backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },

  // Provider grid
  providersGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  providersGridTablet: { justifyContent: 'flex-start' },
  providerCard: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.white, borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: Colors.border, ...Shadows.sm,
    minHeight: TOUCH_MIN,
  },
  providerIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  providerDot: { width: 12, height: 12, borderRadius: 6 },
  providerName: { fontSize: TS.sm, fontWeight: '700', color: Colors.textSecondary, flex: 1 },

  // Info card
  infoCard: {
    flexDirection: 'row', gap: 10, padding: 14, borderRadius: 12,
    backgroundColor: `${Colors.primary}08`, borderWidth: 1,
    borderColor: `${Colors.primary}25`, marginBottom: 16,
  },
  infoText: { flex: 1, fontSize: TS.sm, color: Colors.textSecondary, lineHeight: 18 },
});
