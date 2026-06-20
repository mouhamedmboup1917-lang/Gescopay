import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Shadows } from '@/constants/Colors';
import { MOCK_TRANSACTIONS } from '@/constants/mockData';
import { formatCurrency, formatRelativeDate } from '@/lib/formatters';

export default function MerchantTransactionsScreen() {
  const insets = useSafeAreaInsets();
  const txs = MOCK_TRANSACTIONS.filter((t) => t.type === 'payment').slice(0, 30);
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.navy} />
        </TouchableOpacity>
        <Text style={styles.title}>Transactions</Text>
        <TouchableOpacity style={styles.exportBtn}>
          <Ionicons name="download-outline" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}>
        {txs.map((tx) => (
          <View key={tx.id} style={styles.txRow}>
            <View style={[styles.txIcon, { backgroundColor: `${Colors.primary}15` }]}>
              <Ionicons name="arrow-down-circle" size={20} color={Colors.primary} />
            </View>
            <View style={styles.txInfo}>
              <Text style={styles.txName}>Paiement client</Text>
              <Text style={styles.txRef}>Réf: {tx.reference.slice(-10)}</Text>
              <Text style={styles.txDate}>{formatRelativeDate(tx.createdAt)}</Text>
            </View>
            <Text style={styles.txAmount}>+{formatCurrency(tx.amount, 'XOF', true)}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center', ...Shadows.sm },
  title: { fontSize: 18, fontWeight: '800', color: Colors.navy },
  exportBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: `${Colors.primary}15`, alignItems: 'center', justifyContent: 'center' },
  scroll: { paddingHorizontal: 20, paddingTop: 8 },
  txRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.white, borderRadius: 14, padding: 14, marginBottom: 8, ...Shadows.sm },
  txIcon: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  txInfo: { flex: 1, gap: 2 },
  txName: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  txRef: { fontSize: 11, color: Colors.textMuted },
  txDate: { fontSize: 11, color: Colors.textMuted },
  txAmount: { fontSize: 15, fontWeight: '800', color: Colors.success },
});
