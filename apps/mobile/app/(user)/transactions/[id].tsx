import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors, Shadows } from '@/constants/Colors';
import { MOCK_TRANSACTIONS } from '@/constants/mockData';
import { formatCurrency, formatDateTime } from '@/lib/formatters';
import { LinearGradient } from 'expo-linear-gradient';
import { T } from '@/constants/i18n';
import { PADDING_H, contentContainer, TS, TOUCH_MIN } from '@/constants/Responsive';

function getTxIcon(type: string): any {
  const icons: Record<string, string> = {
    send: 'arrow-up-circle',
    receive: 'arrow-down-circle',
    payment: 'cart',
    top_up: 'add-circle',
    withdrawal: 'cash',
    refund: 'refresh-circle',
  };
  return icons[type] ?? 'ellipse';
}

function getTxColor(type: string): string {
  const c: Record<string, string> = {
    send: Colors.danger,
    receive: Colors.success,
    payment: Colors.orange,
    top_up: Colors.primary,
    withdrawal: Colors.warning,
    refund: '#3B82F6',
  };
  return c[type] ?? Colors.muted;
}

function getTxTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    send: T.transactions.filters.sent,
    receive: T.transactions.filters.received,
    payment: T.transactions.filters.payment,
    top_up: T.transactions.filters.topUp,
    withdrawal: 'Withdrawal',
    refund: 'Refund',
  };
  return labels[type] ?? type;
}

export default function TransactionDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const tx = MOCK_TRANSACTIONS.find((t) => t.id === id) ?? MOCK_TRANSACTIONS[0];
  const isCredit = tx.type === 'receive' || tx.type === 'top_up' || tx.type === 'refund';
  const color = getTxColor(tx.type);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { minHeight: TOUCH_MIN }]}
          accessibilityLabel={T.common.back}
        >
          <Ionicons name="arrow-back" size={22} color={Colors.navy} />
        </TouchableOpacity>
        <Text style={styles.title}>Transaction Details</Text>
        <TouchableOpacity
          style={[styles.shareBtn, { minHeight: TOUCH_MIN }]}
          accessibilityLabel={T.common.share}
        >
          <Ionicons name="share-outline" size={20} color={Colors.navy} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
      >
        <View style={contentContainer}>
          {/* Amount hero */}
          <LinearGradient colors={['#0A2342', '#143567']} style={styles.amountCard}>
            <View style={[styles.txIconLarge, { backgroundColor: `${color}25` }]}>
              <Ionicons name={getTxIcon(tx.type)} size={36} color={color} />
            </View>
            <Text style={[styles.amount, { color: isCredit ? Colors.success : '#FFF' }]}>
              {isCredit ? '+' : '-'}{formatCurrency(tx.amount, tx.currency)}
            </Text>
            <Text style={styles.txDesc}>{tx.merchantName ?? tx.description}</Text>
            <View
              style={[
                styles.statusPill,
                {
                  backgroundColor:
                    tx.status === 'completed' ? `${Colors.success}25` : `${Colors.warning}25`,
                },
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: tx.status === 'completed' ? Colors.success : Colors.warning },
                ]}
              />
              <Text
                style={[
                  styles.statusText,
                  { color: tx.status === 'completed' ? Colors.success : Colors.warning },
                ]}
              >
                {tx.status === 'completed'
                  ? T.transactions.status.completed
                  : T.transactions.status.pending}
              </Text>
            </View>
          </LinearGradient>

          {/* Details */}
          <View style={styles.detailsCard}>
            {[
              { label: T.transfer.success.reference, value: tx.reference },
              { label: 'Type', value: getTxTypeLabel(tx.type) },
              { label: T.transfer.success.date, value: formatDateTime(tx.createdAt) },
              { label: T.transfer.success.fee, value: formatCurrency(tx.fee, tx.currency) },
              { label: 'Net Amount', value: formatCurrency(tx.amount - tx.fee, tx.currency) },
              { label: 'Currency', value: tx.currency },
              tx.fromWallet ? { label: T.transfer.from, value: tx.fromWallet } : null,
              tx.toWallet ? { label: 'To', value: tx.toWallet } : null,
            ]
              .filter(Boolean)
              .map((row) => (
                <View key={row!.label} style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{row!.label}</Text>
                  <Text style={styles.detailValue} numberOfLines={1}>
                    {row!.value}
                  </Text>
                </View>
              ))}
          </View>

          {/* Actions */}
          <View style={styles.actionsRow}>
            <TouchableOpacity style={[styles.actionBtn, { minHeight: TOUCH_MIN }]}>
              <Ionicons name="download-outline" size={18} color={Colors.primary} />
              <Text style={styles.actionText}>Download</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, { minHeight: TOUCH_MIN }]}>
              <Ionicons name="share-outline" size={18} color={Colors.primary} />
              <Text style={styles.actionText}>{T.common.share}</Text>
            </TouchableOpacity>
            {tx.type === 'payment' && (
              <TouchableOpacity
                style={[styles.actionBtn, { borderColor: `${Colors.danger}30`, minHeight: TOUCH_MIN }]}
              >
                <Ionicons name="refresh-outline" size={18} color={Colors.danger} />
                <Text style={[styles.actionText, { color: Colors.danger }]}>Dispute</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  title: { fontSize: 16, fontWeight: '800', color: Colors.navy },
  shareBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  scroll: { paddingTop: 12 },
  amountCard: { borderRadius: 24, padding: 28, alignItems: 'center', gap: 12, marginBottom: 20, ...Shadows.card },
  txIconLarge: { width: 72, height: 72, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  amount: { fontSize: 36, fontWeight: '800' },
  txDesc: { fontSize: 15, color: 'rgba(255,255,255,0.65)', textAlign: 'center' },
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 12, fontWeight: '700' },
  detailsCard: { backgroundColor: Colors.white, borderRadius: 20, padding: 4, marginBottom: 20, ...Shadows.md },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  detailLabel: { fontSize: 13, color: Colors.textMuted },
  detailValue: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary, maxWidth: '60%', textAlign: 'right' },
  actionsRow: { flexDirection: 'row', gap: 10 },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.white,
    borderRadius: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: `${Colors.primary}25`,
    ...Shadows.sm,
  },
  actionText: { fontSize: 12, fontWeight: '700', color: Colors.primary },
});
