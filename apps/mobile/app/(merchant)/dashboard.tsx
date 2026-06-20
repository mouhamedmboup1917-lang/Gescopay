import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Shadows } from '@/constants/Colors';
import {
  CURRENT_MERCHANT,
  MOCK_TRANSACTIONS,
  MONTHLY_REVENUE_DATA,
  WEEKLY_REVENUE_DATA,
  PAYMENT_SOURCES,
  MOCK_SETTLEMENTS,
} from '@/constants/mockData';
import { formatCurrency, formatCompactNumber, formatRelativeDate } from '@/lib/formatters';

const { width } = Dimensions.get('window');

const KPI_CARDS = [
  { label: "Aujourd'hui", value: CURRENT_MERCHANT.todayRevenue, icon: 'today-outline', color: Colors.primary, trend: '+12%' },
  { label: 'Cette semaine', value: CURRENT_MERCHANT.weeklyRevenue, icon: 'calendar-outline', color: Colors.orange, trend: '+8%' },
  { label: 'Ce mois', value: CURRENT_MERCHANT.monthlyRevenue, icon: 'bar-chart-outline', color: '#3B82F6', trend: '+18%' },
  { label: 'Total', value: CURRENT_MERCHANT.totalRevenue, icon: 'trending-up-outline', color: '#8B5CF6', trend: 'Depuis 2023' },
];

const BAR_MAX = Math.max(...WEEKLY_REVENUE_DATA.map((d) => d.amount));

export default function MerchantDashboard() {
  const insets = useSafeAreaInsets();
  const recentTx = MOCK_TRANSACTIONS.filter((t) => t.type === 'payment').slice(0, 5);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}>
        {/* Header */}
        <LinearGradient colors={['#0A2342', '#143567']} style={styles.headerGradient}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={22} color="rgba(255,255,255,0.8)" />
            </TouchableOpacity>
            <View style={styles.headerBranding}>
              <Text style={styles.headerMerchantName}>{CURRENT_MERCHANT.businessName}</Text>
              <View style={styles.verifiedPill}>
                <Ionicons name="checkmark-circle" size={12} color={Colors.success} />
                <Text style={styles.verifiedText}>Vérifié</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.notifBtn}>
              <Ionicons name="notifications-outline" size={22} color="rgba(255,255,255,0.8)" />
            </TouchableOpacity>
          </View>

          <View style={styles.headerStats}>
            <View>
              <Text style={styles.revenueLabel}>Revenu total</Text>
              <Text style={styles.revenueValue}>{formatCurrency(CURRENT_MERCHANT.totalRevenue, 'XOF', true)}</Text>
            </View>
            <View style={styles.transactionsCount}>
              <Text style={styles.txCountValue}>{formatCompactNumber(CURRENT_MERCHANT.transactionCount)}</Text>
              <Text style={styles.txCountLabel}>Transactions</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.quickActionsRow}>
          {[
            { icon: 'qr-code-outline', label: 'QR Code', color: Colors.primary, route: '/(merchant)/qr' },
            { icon: 'document-text-outline', label: 'Factures', color: Colors.orange, route: '/(merchant)/invoices' },
            { icon: 'cash-outline', label: 'Reversements', color: Colors.success, route: '/(merchant)/settlements' },
            { icon: 'receipt-outline', label: 'Transactions', color: '#8B5CF6', route: '/(merchant)/transactions' },
          ].map((action) => (
            <TouchableOpacity
              key={action.label}
              style={styles.quickAction}
              onPress={() => router.push(action.route as any)}
              activeOpacity={0.7}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: `${action.color}15` }]}>
                <Ionicons name={action.icon as any} size={22} color={action.color} />
              </View>
              <Text style={styles.quickActionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* KPI Cards */}
        <View style={styles.kpiRow}>
          {KPI_CARDS.map((kpi) => (
            <View key={kpi.label} style={styles.kpiCard}>
              <View style={[styles.kpiIcon, { backgroundColor: `${kpi.color}15` }]}>
                <Ionicons name={kpi.icon as any} size={16} color={kpi.color} />
              </View>
              <Text style={styles.kpiLabel}>{kpi.label}</Text>
              <Text style={styles.kpiValue}>{formatCurrency(kpi.value, 'XOF', true)}</Text>
              <View style={[styles.kpiTrend, { backgroundColor: kpi.trend.startsWith('+') ? `${Colors.success}15` : `${Colors.primary}10` }]}>
                {kpi.trend.startsWith('+') && <Ionicons name="trending-up" size={10} color={Colors.success} />}
                <Text style={[styles.kpiTrendText, { color: kpi.trend.startsWith('+') ? Colors.success : Colors.primary }]}>
                  {kpi.trend}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Revenue bar chart (manual SVG-free implementation) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Revenus de la semaine</Text>
            <Text style={styles.sectionTotal}>{formatCurrency(CURRENT_MERCHANT.weeklyRevenue, 'XOF', true)}</Text>
          </View>
          <View style={styles.chartCard}>
            <View style={styles.barChart}>
              {WEEKLY_REVENUE_DATA.map((d) => {
                const heightPct = (d.amount / BAR_MAX) * 100;
                return (
                  <View key={d.date} style={styles.barGroup}>
                    <Text style={styles.barValue}>{formatCurrency(d.amount, 'XOF', true)}</Text>
                    <View style={styles.barWrapper}>
                      <LinearGradient
                        colors={['#00A8A8', '#007575']}
                        style={[styles.bar, { height: `${heightPct}%` }]}
                      />
                    </View>
                    <Text style={styles.barLabel}>{d.date}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* Payment sources */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sources de paiement</Text>
          <View style={styles.sourcesCard}>
            <View style={styles.sourcesBar}>
              {PAYMENT_SOURCES.map((s) => (
                <View key={s.name} style={[styles.sourceSegment, { flex: s.percentage, backgroundColor: s.color }]} />
              ))}
            </View>
            <View style={styles.sourcesList}>
              {PAYMENT_SOURCES.map((s) => (
                <View key={s.name} style={styles.sourceItem}>
                  <View style={[styles.sourceDot, { backgroundColor: s.color }]} />
                  <Text style={styles.sourceName}>{s.name}</Text>
                  <Text style={styles.sourcePct}>{s.percentage}%</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Recent transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Transactions récentes</Text>
            <TouchableOpacity onPress={() => router.push('/(merchant)/transactions' as any)}>
              <Text style={styles.seeAll}>Voir tout</Text>
            </TouchableOpacity>
          </View>
          {recentTx.map((tx) => (
            <View key={tx.id} style={styles.txRow}>
              <View style={[styles.txIcon, { backgroundColor: `${Colors.primary}15` }]}>
                <Ionicons name="arrow-down-circle" size={20} color={Colors.primary} />
              </View>
              <View style={styles.txInfo}>
                <Text style={styles.txName}>Paiement client</Text>
                <Text style={styles.txDate}>{formatRelativeDate(tx.createdAt)}</Text>
              </View>
              <View style={styles.txRight}>
                <Text style={styles.txAmount}>+{formatCurrency(tx.amount, 'XOF', true)}</Text>
                <View style={[styles.txStatus, { backgroundColor: `${Colors.success}15` }]}>
                  <Text style={[styles.txStatusText, { color: Colors.success }]}>Reçu</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Pending settlement */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reversements en attente</Text>
          {MOCK_SETTLEMENTS.map((s) => (
            <View key={s.id} style={styles.settlementRow}>
              <View style={[styles.settlIcon, { backgroundColor: `${s.status === 'completed' ? Colors.success : Colors.warning}15` }]}>
                <Ionicons
                  name={s.status === 'completed' ? 'checkmark-circle-outline' : 'time-outline'}
                  size={20}
                  color={s.status === 'completed' ? Colors.success : Colors.warning}
                />
              </View>
              <View style={styles.settlInfo}>
                <Text style={styles.settlRef}>{s.reference.slice(-12)}</Text>
                <Text style={styles.settlDate}>{new Date(s.requestedAt).toLocaleDateString('fr-FR')}</Text>
              </View>
              <View style={styles.settlRight}>
                <Text style={styles.settlNet}>{formatCurrency(s.netAmount, 'XOF', true)}</Text>
                <View style={[styles.settlStatus, { backgroundColor: `${s.status === 'completed' ? Colors.success : Colors.warning}15` }]}>
                  <Text style={[styles.settlStatusText, { color: s.status === 'completed' ? Colors.success : Colors.warning }]}>
                    {s.status === 'completed' ? 'Complété' : 'En cours'}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: {},
  headerGradient: { paddingHorizontal: 20, paddingBottom: 24, marginBottom: 0 },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, marginBottom: 20 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  headerBranding: { flex: 1, alignItems: 'center', gap: 4 },
  headerMerchantName: { fontSize: 16, fontWeight: '800', color: '#FFF', textAlign: 'center' },
  verifiedPill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: `${Colors.success}20`, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3 },
  verifiedText: { fontSize: 11, color: Colors.success, fontWeight: '700' },
  notifBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  headerStats: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  revenueLabel: { fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 4 },
  revenueValue: { fontSize: 32, fontWeight: '800', color: '#FFF' },
  transactionsCount: { alignItems: 'flex-end' },
  txCountValue: { fontSize: 22, fontWeight: '800', color: '#FFF' },
  txCountLabel: { fontSize: 12, color: 'rgba(255,255,255,0.5)' },
  quickActionsRow: {
    flexDirection: 'row', justifyContent: 'space-around',
    backgroundColor: Colors.white, marginHorizontal: 20, borderRadius: 20,
    padding: 16, marginTop: -16, marginBottom: 20, ...Shadows.lg,
  },
  quickAction: { alignItems: 'center', gap: 8 },
  quickActionIcon: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  quickActionLabel: { fontSize: 11, fontWeight: '700', color: Colors.textSecondary },
  kpiRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: 20, marginBottom: 24 },
  kpiCard: {
    width: (width - 52) / 2, backgroundColor: Colors.white, borderRadius: 20, padding: 16, gap: 6, ...Shadows.md,
  },
  kpiIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  kpiLabel: { fontSize: 12, color: Colors.textMuted },
  kpiValue: { fontSize: 18, fontWeight: '800', color: Colors.navy },
  kpiTrend: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start' },
  kpiTrendText: { fontSize: 11, fontWeight: '700' },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: Colors.navy },
  sectionTotal: { fontSize: 14, fontWeight: '700', color: Colors.primary },
  seeAll: { fontSize: 13, fontWeight: '600', color: Colors.primary },
  chartCard: { backgroundColor: Colors.white, borderRadius: 20, padding: 20, ...Shadows.md },
  barChart: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, height: 150 },
  barGroup: { flex: 1, alignItems: 'center', gap: 6 },
  barValue: { fontSize: 9, color: Colors.textMuted, textAlign: 'center' },
  barWrapper: { flex: 1, width: '100%', justifyContent: 'flex-end', alignItems: 'center' },
  bar: { width: '80%', borderRadius: 6, minHeight: 4 },
  barLabel: { fontSize: 11, fontWeight: '600', color: Colors.textSecondary },
  sourcesCard: { backgroundColor: Colors.white, borderRadius: 20, padding: 20, gap: 14, ...Shadows.md },
  sourcesBar: { flexDirection: 'row', height: 12, borderRadius: 6, overflow: 'hidden', gap: 2 },
  sourceSegment: { height: '100%' },
  sourcesList: { gap: 10 },
  sourceItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sourceDot: { width: 8, height: 8, borderRadius: 4 },
  sourceName: { flex: 1, fontSize: 13, color: Colors.textSecondary },
  sourcePct: { fontSize: 13, fontWeight: '800', color: Colors.textPrimary },
  txRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.white, borderRadius: 16, padding: 14, marginBottom: 8, ...Shadows.sm },
  txIcon: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  txInfo: { flex: 1 },
  txName: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  txDate: { fontSize: 12, color: Colors.textMuted },
  txRight: { alignItems: 'flex-end', gap: 4 },
  txAmount: { fontSize: 14, fontWeight: '800', color: Colors.success },
  txStatus: { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  txStatusText: { fontSize: 10, fontWeight: '700' },
  settlementRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.white, borderRadius: 16, padding: 14, marginBottom: 8, ...Shadows.sm },
  settlIcon: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  settlInfo: { flex: 1 },
  settlRef: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  settlDate: { fontSize: 12, color: Colors.textMuted },
  settlRight: { alignItems: 'flex-end', gap: 4 },
  settlNet: { fontSize: 14, fontWeight: '800', color: Colors.navy },
  settlStatus: { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  settlStatusText: { fontSize: 10, fontWeight: '700' },
});
