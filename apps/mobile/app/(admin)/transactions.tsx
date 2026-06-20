import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Shadows } from '@/constants/Colors';
import { MOCK_TRANSACTIONS } from '@/constants/mockData';
import { formatCurrency, formatRelativeDate } from '@/lib/formatters';

const STATUS_COLORS: Record<string, string> = {
  completed: Colors.success, pending: Colors.warning, failed: Colors.danger,
  processing: '#3B82F6', cancelled: Colors.muted, refunded: Colors.primary,
};

export default function AdminTransactionsScreen() {
  const insets = useSafeAreaInsets();
  const txs = MOCK_TRANSACTIONS.slice(0, 100);
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.navy} />
        </TouchableOpacity>
        <Text style={styles.title}>Monitoring Transactions</Text>
        <TouchableOpacity><Ionicons name="funnel-outline" size={20} color={Colors.navy} /></TouchableOpacity>
      </View>
      <FlatList
        data={txs}
        keyExtractor={(t) => t.id}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 40 }]}
        renderItem={({ item: tx }) => {
          const statusColor = STATUS_COLORS[tx.status] ?? Colors.muted;
          return (
            <View style={styles.txRow}>
              <View style={[styles.txIcon, { backgroundColor: `${statusColor}15` }]}>
                <Ionicons name={tx.status === 'failed' ? 'close-circle' : tx.status === 'pending' ? 'time' : 'checkmark-circle'} size={18} color={statusColor} />
              </View>
              <View style={styles.txInfo}>
                <Text style={styles.txRef} numberOfLines={1}>{tx.reference.slice(-12)}</Text>
                <Text style={styles.txType}>{tx.type} · {formatRelativeDate(tx.createdAt)}</Text>
              </View>
              <View style={styles.txRight}>
                <Text style={styles.txAmount}>{formatCurrency(tx.amount, 'XOF', true)}</Text>
                <View style={[styles.statusBadge, { backgroundColor: `${statusColor}15` }]}>
                  <Text style={[styles.statusText, { color: statusColor }]}>{tx.status}</Text>
                </View>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center', ...Shadows.sm },
  title: { fontSize: 15, fontWeight: '800', color: Colors.navy },
  list: { paddingHorizontal: 20, paddingTop: 8 },
  txRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colors.white, borderRadius: 12, padding: 12, marginBottom: 6, ...Shadows.sm },
  txIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  txInfo: { flex: 1, gap: 2 },
  txRef: { fontSize: 12, fontWeight: '700', color: Colors.textPrimary, fontFamily: 'monospace' },
  txType: { fontSize: 10, color: Colors.textMuted },
  txRight: { alignItems: 'flex-end', gap: 3 },
  txAmount: { fontSize: 13, fontWeight: '800', color: Colors.navy },
  statusBadge: { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  statusText: { fontSize: 9, fontWeight: '700' },
});
