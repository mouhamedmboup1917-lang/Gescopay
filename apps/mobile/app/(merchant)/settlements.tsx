import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Shadows } from '@/constants/Colors';
import { MOCK_SETTLEMENTS } from '@/constants/mockData';
import { formatCurrency, formatDateTime } from '@/lib/formatters';

const STATUS_CONFIG: Record<string, { color: string; label: string; icon: any }> = {
  completed: { color: Colors.success, label: 'Complété', icon: 'checkmark-circle' },
  processing: { color: Colors.warning, label: 'En cours', icon: 'time' },
  pending: { color: Colors.muted, label: 'En attente', icon: 'hourglass' },
  failed: { color: Colors.danger, label: 'Échoué', icon: 'close-circle' },
};

export default function SettlementsScreen() {
  const insets = useSafeAreaInsets();
  const pendingAmount = MOCK_SETTLEMENTS.filter((s) => s.status !== 'completed').reduce((sum, s) => sum + s.netAmount, 0);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.navy} />
        </TouchableOpacity>
        <Text style={styles.title}>Reversements</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}>
        {/* Pending balance card */}
        <LinearGradient colors={['#FF7A00', '#CC6200']} style={styles.pendingCard}>
          <Text style={styles.pendingLabel}>Solde à reverser</Text>
          <Text style={styles.pendingAmount}>{formatCurrency(pendingAmount, 'XOF')}</Text>
          <TouchableOpacity style={styles.requestBtn}>
            <Text style={styles.requestBtnText}>Demander un reversement</Text>
            <Ionicons name="arrow-forward" size={16} color={Colors.orange} />
          </TouchableOpacity>
        </LinearGradient>

        {/* Settlement options */}
        <Text style={styles.sectionTitle}>Options de reversement</Text>
        {[
          { icon: 'card-outline', label: 'Vers un compte bancaire', sub: 'CBAO, Ecobank, BDK...', color: '#3B82F6' },
          { icon: 'wallet-outline', label: 'Vers un wallet mobile', sub: 'Wave, Orange Money, Free Money', color: Colors.primary },
        ].map((opt) => (
          <TouchableOpacity key={opt.label} style={styles.optionCard}>
            <View style={[styles.optionIcon, { backgroundColor: `${opt.color}15` }]}>
              <Ionicons name={opt.icon as any} size={20} color={opt.color} />
            </View>
            <View style={styles.optionInfo}>
              <Text style={styles.optionLabel}>{opt.label}</Text>
              <Text style={styles.optionSub}>{opt.sub}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.muted} />
          </TouchableOpacity>
        ))}

        <Text style={styles.sectionTitle}>Historique des reversements</Text>
        {MOCK_SETTLEMENTS.map((s) => {
          const config = STATUS_CONFIG[s.status] ?? STATUS_CONFIG.pending;
          return (
            <View key={s.id} style={styles.settlementCard}>
              <View style={styles.settlementTop}>
                <View style={[styles.settlIcon, { backgroundColor: `${config.color}15` }]}>
                  <Ionicons name={config.icon} size={20} color={config.color} />
                </View>
                <View style={styles.settlInfo}>
                  <Text style={styles.settlRef}>{s.reference.slice(-14)}</Text>
                  <Text style={styles.settlDate}>{formatDateTime(s.requestedAt)}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: `${config.color}15` }]}>
                  <Text style={[styles.statusText, { color: config.color }]}>{config.label}</Text>
                </View>
              </View>
              <View style={styles.settlDetails}>
                <View>
                  <Text style={styles.settlDetailLabel}>Montant brut</Text>
                  <Text style={styles.settlDetailValue}>{formatCurrency(s.amount, 'XOF')}</Text>
                </View>
                <View>
                  <Text style={styles.settlDetailLabel}>Frais</Text>
                  <Text style={[styles.settlDetailValue, { color: Colors.danger }]}>-{formatCurrency(s.fee, 'XOF')}</Text>
                </View>
                <View>
                  <Text style={styles.settlDetailLabel}>Net reçu</Text>
                  <Text style={[styles.settlDetailValue, { color: Colors.success, fontWeight: '800' }]}>{formatCurrency(s.netAmount, 'XOF')}</Text>
                </View>
              </View>
              <View style={styles.settlDest}>
                <Ionicons name={s.destinationType === 'bank' ? 'card-outline' : 'wallet-outline'} size={14} color={Colors.muted} />
                <Text style={styles.settlDestText}>
                  {s.destinationType === 'bank'
                    ? `${s.destinationDetails.bankName} · ${s.destinationDetails.accountNumber?.slice(-8)}`
                    : `${s.destinationDetails.walletProvider} · ${s.destinationDetails.walletPhone}`}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center', ...Shadows.sm },
  title: { fontSize: 18, fontWeight: '800', color: Colors.navy },
  scroll: { paddingHorizontal: 20, paddingTop: 8 },
  pendingCard: { borderRadius: 20, padding: 24, marginBottom: 24, gap: 8, ...Shadows.card },
  pendingLabel: { fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  pendingAmount: { fontSize: 32, fontWeight: '800', color: '#FFF' },
  requestBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FFF', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10, alignSelf: 'flex-start', marginTop: 8 },
  requestBtnText: { fontSize: 13, fontWeight: '700', color: Colors.orange },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: Colors.navy, marginBottom: 12 },
  optionCard: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: Colors.white, borderRadius: 16, padding: 16, marginBottom: 10, ...Shadows.sm },
  optionIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  optionInfo: { flex: 1 },
  optionLabel: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  optionSub: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  settlementCard: { backgroundColor: Colors.white, borderRadius: 18, padding: 16, marginBottom: 12, ...Shadows.md },
  settlementTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  settlIcon: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  settlInfo: { flex: 1 },
  settlRef: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  settlDate: { fontSize: 11, color: Colors.textMuted },
  statusBadge: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5 },
  statusText: { fontSize: 11, fontWeight: '700' },
  settlDetails: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: Colors.background, borderRadius: 12, padding: 14, marginBottom: 12 },
  settlDetailLabel: { fontSize: 11, color: Colors.textMuted, marginBottom: 4 },
  settlDetailValue: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  settlDest: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  settlDestText: { fontSize: 12, color: Colors.textMuted },
});
