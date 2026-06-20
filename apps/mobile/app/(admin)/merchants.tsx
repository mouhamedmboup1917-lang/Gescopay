import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Shadows } from '@/constants/Colors';
import { MOCK_MERCHANTS } from '@/constants/mockData';
import { formatCurrency } from '@/lib/formatters';

export default function AdminMerchantsScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.navy} />
        </TouchableOpacity>
        <Text style={styles.title}>Marchands ({MOCK_MERCHANTS.length})</Text>
        <View style={{ width: 40 }} />
      </View>
      <FlatList
        data={MOCK_MERCHANTS}
        keyExtractor={(m) => m.id}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 40 }]}
        renderItem={({ item: m }) => (
          <View style={styles.merchantRow}>
            <View style={[styles.merchantIcon, { backgroundColor: `${Colors.orange}15` }]}>
              <Ionicons name="storefront-outline" size={20} color={Colors.orange} />
            </View>
            <View style={styles.merchantInfo}>
              <Text style={styles.merchantName}>{m.businessName}</Text>
              <Text style={styles.merchantType}>{m.businessType} · {m.city}</Text>
              <Text style={styles.merchantRevenue}>{formatCurrency(m.totalRevenue, 'XOF', true)} de CA</Text>
            </View>
            <View style={styles.merchantRight}>
              <View style={[styles.verBadge, { backgroundColor: m.isVerified ? `${Colors.success}15` : `${Colors.warning}15` }]}>
                <Text style={[styles.verText, { color: m.isVerified ? Colors.success : Colors.warning }]}>
                  {m.isVerified ? 'Vérifié' : 'Attente'}
                </Text>
              </View>
              {!m.isVerified && (
                <View style={styles.actionBtns}>
                  <TouchableOpacity style={[styles.actionBtn, { backgroundColor: `${Colors.success}15` }]}>
                    <Ionicons name="checkmark" size={12} color={Colors.success} />
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionBtn, { backgroundColor: `${Colors.danger}15` }]}>
                    <Ionicons name="close" size={12} color={Colors.danger} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center', ...Shadows.sm },
  title: { fontSize: 16, fontWeight: '800', color: Colors.navy },
  list: { paddingHorizontal: 20, paddingTop: 8 },
  merchantRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.white, borderRadius: 14, padding: 12, marginBottom: 8, ...Shadows.sm },
  merchantIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  merchantInfo: { flex: 1, gap: 2 },
  merchantName: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  merchantType: { fontSize: 11, color: Colors.textMuted },
  merchantRevenue: { fontSize: 11, color: Colors.primary, fontWeight: '600' },
  merchantRight: { alignItems: 'flex-end', gap: 6 },
  verBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  verText: { fontSize: 10, fontWeight: '700' },
  actionBtns: { flexDirection: 'row', gap: 4 },
  actionBtn: { width: 26, height: 26, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
});
