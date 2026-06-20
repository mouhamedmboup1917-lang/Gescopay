import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Shadows } from '@/constants/Colors';
import { ADMIN_METRICS, MOCK_USERS, MOCK_MERCHANTS, MOCK_TRANSACTIONS } from '@/constants/mockData';
import { formatCurrency, formatCompactNumber, formatRelativeDate } from '@/lib/formatters';

const { width } = Dimensions.get('window');

const METRIC_CARDS = [
  { label: 'Utilisateurs', value: ADMIN_METRICS.totalUsers, icon: 'people-outline', color: Colors.primary, sub: `${ADMIN_METRICS.activeUsers.toLocaleString('fr')} actifs` },
  { label: 'Marchands', value: ADMIN_METRICS.totalMerchants, icon: 'storefront-outline', color: Colors.orange, sub: `${ADMIN_METRICS.verifiedMerchants.toLocaleString('fr')} vérifiés` },
  { label: 'Transactions', value: ADMIN_METRICS.totalTransactions, icon: 'swap-horizontal-outline', color: '#3B82F6', sub: `${ADMIN_METRICS.todayTransactions.toLocaleString('fr')} aujourd'hui` },
  { label: 'GMV', value: ADMIN_METRICS.monthlyGmv, icon: 'trending-up-outline', color: '#8B5CF6', sub: 'Ce mois', isCurrency: true },
  { label: 'Alertes fraude', value: ADMIN_METRICS.fraudAlerts, icon: 'warning-outline', color: Colors.danger, sub: 'En attente' },
  { label: 'KYC en attente', value: ADMIN_METRICS.pendingKyc, icon: 'person-outline', color: Colors.warning, sub: 'À traiter' },
];

export default function AdminDashboard() {
  const insets = useSafeAreaInsets();
  const recentTx = MOCK_TRANSACTIONS.slice(0, 10);
  const pendingMerchants = MOCK_MERCHANTS.filter((m) => !m.isVerified).slice(0, 5);
  const newUsers = MOCK_USERS.slice(80, 90);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}>
        {/* Header */}
        <LinearGradient colors={['#0A2342', '#143567']} style={styles.headerGradient}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={22} color="rgba(255,255,255,0.8)" />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <View style={styles.adminBadge}>
                <Ionicons name="shield-outline" size={14} color={Colors.danger} />
                <Text style={styles.adminBadgeText}>ADMIN</Text>
              </View>
              <Text style={styles.headerTitle}>Tableau de bord Admin</Text>
            </View>
            <TouchableOpacity style={styles.alertBtn}>
              <Ionicons name="notifications-outline" size={22} color="rgba(255,255,255,0.8)" />
              <View style={styles.alertBadge}>
                <Text style={styles.alertBadgeText}>{ADMIN_METRICS.fraudAlerts}</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.gmvCard}>
            <Text style={styles.gmvLabel}>Volume de Transactions Total (GMV)</Text>
            <Text style={styles.gmvValue}>{formatCurrency(ADMIN_METRICS.gmv, 'XOF', true)}</Text>
            <View style={styles.gmvSub}>
              <View style={[styles.gmvBadge, { backgroundColor: `${Colors.success}20` }]}>
                <Ionicons name="trending-up" size={12} color={Colors.success} />
                <Text style={[styles.gmvBadgeText, { color: Colors.success }]}>+24% ce mois</Text>
              </View>
              <Text style={styles.gmvMonthly}>
                Ce mois: {formatCurrency(ADMIN_METRICS.monthlyGmv, 'XOF', true)}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Navigation tabs */}
        <View style={styles.navTabs}>
          {[
            { label: 'Utilisateurs', icon: 'people-outline', route: '/(admin)/users' },
            { label: 'Marchands', icon: 'storefront-outline', route: '/(admin)/merchants' },
            { label: 'Transactions', icon: 'swap-horizontal-outline', route: '/(admin)/transactions' },
            { label: 'Tickets', icon: 'chatbubble-outline', route: null },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.label}
              style={styles.navTab}
              onPress={() => tab.route && router.push(tab.route as any)}
            >
              <Ionicons name={tab.icon as any} size={18} color={Colors.navy} />
              <Text style={styles.navTabText}>{tab.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Metric cards */}
        <View style={styles.metricsGrid}>
          {METRIC_CARDS.map((m) => (
            <View key={m.label} style={styles.metricCard}>
              <View style={[styles.metricIcon, { backgroundColor: `${m.color}15` }]}>
                <Ionicons name={m.icon as any} size={18} color={m.color} />
              </View>
              <Text style={styles.metricValue}>
                {m.isCurrency
                  ? formatCurrency(m.value, 'XOF', true)
                  : formatCompactNumber(m.value)
                }
              </Text>
              <Text style={styles.metricLabel}>{m.label}</Text>
              <Text style={styles.metricSub}>{m.sub}</Text>
            </View>
          ))}
        </View>

        {/* Alerts */}
        {ADMIN_METRICS.fraudAlerts > 0 && (
          <View style={styles.alertBanner}>
            <Ionicons name="warning" size={20} color={Colors.warning} />
            <View style={styles.alertInfo}>
              <Text style={styles.alertTitle}>{ADMIN_METRICS.fraudAlerts} alertes de fraude actives</Text>
              <Text style={styles.alertSub}>Nécessitent votre attention immédiate</Text>
            </View>
            <TouchableOpacity style={styles.alertActionBtn}>
              <Text style={styles.alertActionText}>Voir</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Pending merchant verifications */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Marchands à vérifier</Text>
            <TouchableOpacity onPress={() => router.push('/(admin)/merchants' as any)}>
              <Text style={styles.seeAll}>Voir tout</Text>
            </TouchableOpacity>
          </View>
          {pendingMerchants.map((m) => (
            <View key={m.id} style={styles.merchantRow}>
              <View style={[styles.merchantAvatar, { backgroundColor: `${Colors.orange}15` }]}>
                <Ionicons name="storefront-outline" size={20} color={Colors.orange} />
              </View>
              <View style={styles.merchantInfo}>
                <Text style={styles.merchantName}>{m.businessName}</Text>
                <Text style={styles.merchantType}>{m.businessType} · {m.city}</Text>
              </View>
              <View style={styles.merchantActions}>
                <TouchableOpacity style={[styles.merchantActionBtn, { backgroundColor: `${Colors.success}15` }]}>
                  <Ionicons name="checkmark" size={14} color={Colors.success} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.merchantActionBtn, { backgroundColor: `${Colors.danger}15` }]}>
                  <Ionicons name="close" size={14} color={Colors.danger} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Recent transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Transactions récentes</Text>
            <TouchableOpacity onPress={() => router.push('/(admin)/transactions' as any)}>
              <Text style={styles.seeAll}>Voir tout</Text>
            </TouchableOpacity>
          </View>
          {recentTx.map((tx) => (
            <View key={tx.id} style={styles.txRow}>
              <View style={[styles.txIcon, { backgroundColor: `${tx.status === 'failed' ? Colors.danger : Colors.primary}15` }]}>
                <Ionicons
                  name={tx.status === 'failed' ? 'close-circle-outline' : 'checkmark-circle-outline'}
                  size={18}
                  color={tx.status === 'failed' ? Colors.danger : Colors.primary}
                />
              </View>
              <View style={styles.txInfo}>
                <Text style={styles.txRef}>{tx.reference.slice(-12)}</Text>
                <Text style={styles.txMeta}>{tx.type} · {formatRelativeDate(tx.createdAt)}</Text>
              </View>
              <Text style={styles.txAmount}>{formatCurrency(tx.amount, 'XOF', true)}</Text>
            </View>
          ))}
        </View>

        {/* New users */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nouveaux utilisateurs</Text>
            <TouchableOpacity onPress={() => router.push('/(admin)/users' as any)}>
              <Text style={styles.seeAll}>Voir tout</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.usersTable}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Nom</Text>
              <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Email</Text>
              <Text style={[styles.tableHeaderCell, { flex: 1 }]}>KYC</Text>
              <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Pays</Text>
            </View>
            {newUsers.map((user, i) => (
              <View key={user.id} style={[styles.tableRow, i % 2 === 0 && styles.tableRowAlt]}>
                <Text style={[styles.tableCell, { flex: 2 }]} numberOfLines={1}>{user.firstName} {user.lastName}</Text>
                <Text style={[styles.tableCell, { flex: 2, color: Colors.textMuted }]} numberOfLines={1}>{user.email.slice(0, 20)}...</Text>
                <View style={{ flex: 1 }}>
                  <View style={[styles.kycBadge, { backgroundColor: user.kycStatus === 'verified' ? `${Colors.success}15` : `${Colors.warning}15` }]}>
                    <Text style={[styles.kycText, { color: user.kycStatus === 'verified' ? Colors.success : Colors.warning }]}>
                      {user.kycStatus === 'verified' ? 'OK' : 'Attente'}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.tableCell, { flex: 1 }]}>{user.country}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: {},
  headerGradient: { paddingHorizontal: 20, paddingBottom: 24 },
  headerRow: { flexDirection: 'row', alignItems: 'center', paddingTop: 16, marginBottom: 20 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1, alignItems: 'center', gap: 4 },
  adminBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: `${Colors.danger}25`, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  adminBadgeText: { fontSize: 10, fontWeight: '800', color: Colors.danger, letterSpacing: 1 },
  headerTitle: { fontSize: 15, fontWeight: '800', color: '#FFF' },
  alertBtn: { position: 'relative', width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  alertBadge: { position: 'absolute', top: 4, right: 4, width: 16, height: 16, borderRadius: 8, backgroundColor: Colors.danger, alignItems: 'center', justifyContent: 'center' },
  alertBadgeText: { fontSize: 9, fontWeight: '800', color: '#FFF' },
  gmvCard: { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 20, padding: 20 },
  gmvLabel: { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 6 },
  gmvValue: { fontSize: 36, fontWeight: '800', color: '#FFF', marginBottom: 12 },
  gmvSub: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  gmvBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4 },
  gmvBadgeText: { fontSize: 12, fontWeight: '700' },
  gmvMonthly: { fontSize: 12, color: 'rgba(255,255,255,0.5)' },
  navTabs: {
    flexDirection: 'row', backgroundColor: Colors.white,
    marginHorizontal: 20, borderRadius: 20, padding: 8,
    marginTop: -16, marginBottom: 20, ...Shadows.lg,
  },
  navTab: { flex: 1, alignItems: 'center', gap: 4, paddingVertical: 8 },
  navTabText: { fontSize: 10, fontWeight: '700', color: Colors.navy },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: 20, marginBottom: 20 },
  metricCard: { width: (width - 52) / 2, backgroundColor: Colors.white, borderRadius: 16, padding: 14, gap: 4, ...Shadows.sm },
  metricIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  metricValue: { fontSize: 20, fontWeight: '800', color: Colors.navy },
  metricLabel: { fontSize: 12, fontWeight: '700', color: Colors.textSecondary },
  metricSub: { fontSize: 11, color: Colors.textMuted },
  alertBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: `${Colors.warning}12`, borderRadius: 16, padding: 16,
    marginHorizontal: 20, marginBottom: 20, borderWidth: 1, borderColor: `${Colors.warning}30`,
  },
  alertInfo: { flex: 1 },
  alertTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  alertSub: { fontSize: 12, color: Colors.textMuted },
  alertActionBtn: { backgroundColor: Colors.warning, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
  alertActionText: { fontSize: 13, fontWeight: '700', color: '#FFF' },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: Colors.navy },
  seeAll: { fontSize: 13, fontWeight: '600', color: Colors.primary },
  merchantRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.white, borderRadius: 14, padding: 14, marginBottom: 8, ...Shadows.sm },
  merchantAvatar: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  merchantInfo: { flex: 1 },
  merchantName: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  merchantType: { fontSize: 12, color: Colors.textMuted },
  merchantActions: { flexDirection: 'row', gap: 8 },
  merchantActionBtn: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  txRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.white, borderRadius: 14, padding: 14, marginBottom: 6, ...Shadows.sm },
  txIcon: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  txInfo: { flex: 1 },
  txRef: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  txMeta: { fontSize: 11, color: Colors.textMuted },
  txAmount: { fontSize: 13, fontWeight: '800', color: Colors.navy },
  usersTable: { backgroundColor: Colors.white, borderRadius: 16, overflow: 'hidden', ...Shadows.sm },
  tableHeader: { flexDirection: 'row', backgroundColor: Colors.surfaceSecondary, paddingHorizontal: 14, paddingVertical: 10 },
  tableHeaderCell: { fontSize: 11, fontWeight: '700', color: Colors.textMuted, textTransform: 'uppercase' },
  tableRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  tableRowAlt: { backgroundColor: `${Colors.background}60` },
  tableCell: { fontSize: 12, color: Colors.textPrimary },
  kycBadge: { borderRadius: 8, paddingHorizontal: 6, paddingVertical: 3, alignSelf: 'flex-start' },
  kycText: { fontSize: 10, fontWeight: '700' },
});
