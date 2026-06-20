import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Shadows } from '@/constants/Colors';
import { MOCK_TRANSACTIONS } from '@/constants/mockData';
import { formatCurrency, formatRelativeDate } from '@/lib/formatters';
import { Transaction } from '@/types';
import { T } from '@/constants/i18n';
import { PADDING_H, contentContainer, TS, TOUCH_MIN } from '@/constants/Responsive';

export default function TransactionsScreen() {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState('all');
  const [activeStatus, setActiveStatus] = useState('all_status');
  const [activePeriod, setActivePeriod] = useState('30d');
  const [showPeriodPicker, setShowPeriodPicker] = useState(false);

  // ===== FILTER CONFIG =====
  const TYPE_FILTERS = useMemo(() => [
    { id: 'all', label: T.transactions.filters.all, icon: 'apps-outline' },
    { id: 'send', label: T.transactions.filters.sent, icon: 'arrow-up-outline' },
    { id: 'receive', label: T.transactions.filters.received, icon: 'arrow-down-outline' },
    { id: 'payment', label: T.transactions.filters.payment, icon: 'cart-outline' },
    { id: 'top_up', label: T.transactions.filters.topUp, icon: 'add-circle-outline' },
  ], []);

  const STATUS_FILTERS = useMemo(() => [
    { id: 'all_status', label: T.transactions.filters.allStatuses },
    { id: 'completed', label: T.transactions.filters.completed },
    { id: 'pending', label: T.transactions.filters.pending },
    { id: 'failed', label: T.transactions.filters.failed },
  ], []);

  // ===== PERIOD CONFIG =====
  const PERIOD_OPTIONS = useMemo(() => [
    { id: '7d', label: T.transactions.period.days7, days: 7 },
    { id: '30d', label: T.transactions.period.days30, days: 30 },
    { id: '90d', label: T.transactions.period.days90, days: 90 },
    { id: 'all', label: T.transactions.period.all, days: Infinity },
  ], []);

  const currentPeriod = PERIOD_OPTIONS.find((p) => p.id === activePeriod)!;

  // ===== FILTERING =====
  const filtered = useMemo(() => {
    const cutoff = currentPeriod.days === Infinity
      ? new Date(0)
      : new Date(Date.now() - currentPeriod.days * 86400 * 1000);

    return MOCK_TRANSACTIONS.filter((tx) => {
      const matchesSearch =
        !search ||
        tx.description.toLowerCase().includes(search.toLowerCase()) ||
        (tx.merchantName ?? '').toLowerCase().includes(search.toLowerCase()) ||
        tx.reference.toLowerCase().includes(search.toLowerCase());

      const matchesType = activeType === 'all' || tx.type === activeType;
      const matchesStatus = activeStatus === 'all_status' || tx.status === activeStatus;
      const matchesPeriod = new Date(tx.createdAt) >= cutoff;

      return matchesSearch && matchesType && matchesStatus && matchesPeriod;
    }).slice(0, 100);
  }, [search, activeType, activeStatus, activePeriod]);

  // ===== STATS (reactive) =====
  const stats = useMemo(() => {
    const out = filtered
      .filter((t) => ['send', 'payment', 'withdrawal'].includes(t.type))
      .reduce((s, t) => s + t.amount, 0);
    const inc = filtered
      .filter((t) => ['receive', 'top_up', 'refund'].includes(t.type))
      .reduce((s, t) => s + t.amount, 0);
    return { total: filtered.length, out, inc, net: inc - out };
  }, [filtered]);

  // ===== GROUPING =====
  const sections = useMemo(() => {
    const grouped = filtered.reduce((acc: Record<string, Transaction[]>, tx) => {
      const date = new Date(tx.createdAt).toLocaleDateString('en-US', {
        day: '2-digit', month: 'long', year: 'numeric',
      });
      if (!acc[date]) acc[date] = [];
      acc[date].push(tx);
      return acc;
    }, {});
    return Object.entries(grouped).slice(0, 20);
  }, [filtered]);

  const handleReset = () => {
    setSearch('');
    setActiveType('all');
    setActiveStatus('all_status');
    setActivePeriod('30d');
  };

  const hasActiveFilter = activeType !== 'all' || activeStatus !== 'all_status' || search !== '' || activePeriod !== '30d';

  const getTxIcon = (type: string): any => {
    const icons: Record<string, string> = {
      send: 'arrow-up-circle', receive: 'arrow-down-circle', payment: 'cart',
      top_up: 'add-circle', withdrawal: 'cash', refund: 'refresh-circle',
    };
    return icons[type] ?? 'ellipse';
  };

  const getTxColor = (type: string): string => {
    const c: Record<string, string> = {
      send: Colors.danger, receive: Colors.success, payment: Colors.orange,
      top_up: Colors.primary, withdrawal: Colors.warning, refund: Colors.info,
    };
    return c[type] ?? Colors.muted;
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { color: string; label: string }> = {
      completed: { color: Colors.success, label: T.transactions.status.completed },
      pending: { color: Colors.warning, label: T.transactions.status.pending },
      processing: { color: Colors.info, label: T.transactions.status.processing },
      failed: { color: Colors.danger, label: T.transactions.status.failed },
      cancelled: { color: Colors.muted, label: T.transactions.status.cancelled },
    };
    return config[status] ?? { color: Colors.muted, label: status };
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* ===== HEADER ===== */}
      <View style={styles.header}>
        <Text style={styles.title}>{T.transactions.title}</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[styles.periodBtn, { minHeight: TOUCH_MIN }]}
            onPress={() => setShowPeriodPicker(!showPeriodPicker)}
            accessibilityLabel={`Period: ${currentPeriod.label}`}
          >
            <Ionicons name="calendar-outline" size={15} color={Colors.primary} />
            <Text style={styles.periodBtnText}>{currentPeriod.label}</Text>
            <Ionicons name={showPeriodPicker ? 'chevron-up' : 'chevron-down'} size={13} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.exportBtn, { minHeight: TOUCH_MIN }]}
            accessibilityLabel={T.transactions.export}
          >
            <Ionicons name="download-outline" size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ===== PERIOD PICKER ===== */}
      {showPeriodPicker && (
        <View style={styles.periodDropdown}>
          {PERIOD_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.id}
              style={[styles.periodOption, activePeriod === opt.id && styles.periodOptionActive, { minHeight: TOUCH_MIN }]}
              onPress={() => { setActivePeriod(opt.id); setShowPeriodPicker(false); }}
            >
              <Text style={[styles.periodOptionText, activePeriod === opt.id && styles.periodOptionTextActive]}>
                {opt.label}
              </Text>
              {activePeriod === opt.id && <Ionicons name="checkmark" size={16} color={Colors.primary} />}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* ===== STATS BAR ===== */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>{stats.total}</Text>
          <Text style={styles.statValue}>{T.transactions.stats.total}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: Colors.danger }]}>
            -{formatCurrency(stats.out, 'XOF', true)}
          </Text>
          <Text style={styles.statValue}>{T.transactions.stats.spent}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: Colors.success }]}>
            +{formatCurrency(stats.inc, 'XOF', true)}
          </Text>
          <Text style={styles.statValue}>{T.transactions.stats.received}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: stats.net >= 0 ? Colors.success : Colors.danger }]}>
            {stats.net >= 0 ? '+' : ''}{formatCurrency(Math.abs(stats.net), 'XOF', true)}
          </Text>
          <Text style={styles.statValue}>{T.transactions.stats.net}</Text>
        </View>
      </View>

      {/* ===== SEARCH ===== */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={18} color={Colors.muted} />
          <TextInput
            style={styles.searchInput}
            placeholder={T.transactions.searchPlaceholder}
            placeholderTextColor={Colors.muted}
            value={search}
            onChangeText={setSearch}
            accessibilityLabel={T.transactions.searchPlaceholder}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')} accessibilityLabel="Clear search">
              <Ionicons name="close-circle" size={18} color={Colors.muted} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* ===== TYPE FILTERS ===== */}
      <View style={styles.filtersSection}>
        <Text style={styles.filtersLabel}>{T.transactions.filters.type}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersContent}>
          {TYPE_FILTERS.map((f) => (
            <TouchableOpacity
              key={f.id}
              style={[styles.filterBtn, activeType === f.id && styles.filterBtnActive, { minHeight: TOUCH_MIN }]}
              onPress={() => setActiveType(f.id)}
              accessibilityLabel={`Filter by ${f.label}`}
            >
              <Ionicons
                name={f.icon as any}
                size={13}
                color={activeType === f.id ? '#FFF' : Colors.textMuted}
              />
              <Text style={[styles.filterText, activeType === f.id && styles.filterTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ===== STATUS FILTERS ===== */}
      <View style={[styles.filtersSection, { marginBottom: 8 }]}>
        <Text style={styles.filtersLabel}>{T.transactions.filters.status}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersContent}>
          {STATUS_FILTERS.map((f) => (
            <TouchableOpacity
              key={f.id}
              style={[styles.filterBtnStatus, activeStatus === f.id && styles.filterBtnStatusActive, { minHeight: TOUCH_MIN }]}
              onPress={() => setActiveStatus(f.id)}
              accessibilityLabel={`Filter by status ${f.label}`}
            >
              <Text style={[styles.filterText, activeStatus === f.id && styles.filterTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ===== TRANSACTION LIST ===== */}
      <FlatList
        data={sections}
        keyExtractor={([date]) => date}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 100 }]}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="receipt-outline" size={36} color={Colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>{T.transactions.empty.title}</Text>
            <Text style={styles.emptySubtitle}>{T.transactions.empty.subtitle}</Text>
            {hasActiveFilter && (
              <TouchableOpacity style={[styles.resetBtn, { minHeight: TOUCH_MIN }]} onPress={handleReset}>
                <Text style={styles.resetBtnText}>{T.transactions.empty.reset}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        renderItem={({ item: [date, txs] }) => (
          <View style={[styles.dateGroup, contentContainer]}>
            <Text style={styles.dateLabel}>{date}</Text>
            {txs.map((tx) => {
              const badge = getStatusBadge(tx.status);
              const isCredit = tx.type === 'receive' || tx.type === 'top_up' || tx.type === 'refund';
              const hour = new Date(tx.createdAt).toLocaleTimeString('en-US', {
                hour: '2-digit', minute: '2-digit',
              });
              return (
                <TouchableOpacity
                  key={tx.id}
                  style={[styles.txRow, { minHeight: TOUCH_MIN }]}
                  onPress={() => router.push(`/(user)/transactions/${tx.id}` as any)}
                  activeOpacity={0.7}
                  accessibilityLabel={`${tx.merchantName ?? tx.description}, ${tx.amount} XOF`}
                >
                  <View style={[styles.txIcon, { backgroundColor: `${getTxColor(tx.type)}15` }]}>
                    <Ionicons name={getTxIcon(tx.type)} size={20} color={getTxColor(tx.type)} />
                  </View>
                  <View style={styles.txInfo}>
                    <Text style={styles.txName} numberOfLines={1}>
                      {tx.merchantName ?? tx.description}
                    </Text>
                    <Text style={styles.txMeta}>
                      {hour} · {formatRelativeDate(tx.createdAt)}
                    </Text>
                  </View>
                  <View style={styles.txRight}>
                    <Text style={[styles.txAmount, { color: isCredit ? Colors.success : Colors.textPrimary }]}>
                      {isCredit ? '+' : '-'}{formatCurrency(tx.amount, 'XOF', true)}
                    </Text>
                    <View style={[styles.statusBadge, { backgroundColor: `${badge.color}15` }]}>
                      <Text style={[styles.statusText, { color: badge.color }]}>{badge.label}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  // Header
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 12,
  },
  title: { fontSize: TS.h1, fontWeight: '800', color: Colors.navy },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  periodBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: `${Colors.primary}12`, borderRadius: 10,
    paddingHorizontal: 10, paddingVertical: 8,
    borderWidth: 1, borderColor: `${Colors.primary}25`,
  },
  periodBtnText: { fontSize: 13, fontWeight: '700', color: Colors.primary },
  exportBtn: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: `${Colors.primary}12`, alignItems: 'center', justifyContent: 'center',
  },

  // Period dropdown
  periodDropdown: {
    marginHorizontal: 20, backgroundColor: Colors.white,
    borderRadius: 14, padding: 4, marginBottom: 8,
    ...Shadows.md,
    zIndex: 100,
  },
  periodOption: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12, borderRadius: 10,
  },
  periodOptionActive: { backgroundColor: `${Colors.primary}10` },
  periodOptionText: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  periodOptionTextActive: { color: Colors.primary },

  // Stats bar
  statsBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, marginHorizontal: 20,
    borderRadius: 16, padding: 14, marginBottom: 12, ...Shadows.sm,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statLabel: { fontSize: 12, fontWeight: '800', color: Colors.textPrimary, marginBottom: 3 },
  statValue: { fontSize: 10, color: Colors.textMuted, fontWeight: '600' },
  statDivider: { width: 1, height: 28, backgroundColor: Colors.border },

  // Search
  searchWrapper: { paddingHorizontal: 20, marginBottom: 10 },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.white, borderRadius: 14, paddingHorizontal: 14,
    height: 48, borderWidth: 1, borderColor: Colors.border, ...Shadows.sm,
  },
  searchInput: { flex: 1, fontSize: 14, color: Colors.textPrimary },

  // Filters
  filtersSection: { paddingLeft: 20, marginBottom: 4 },
  filtersLabel: {
    fontSize: 10, fontWeight: '700', color: Colors.textMuted,
    letterSpacing: 1, marginBottom: 6,
  },
  filtersContent: { gap: 7, paddingRight: 20 },
  filterBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingVertical: 7, paddingHorizontal: 12, borderRadius: 20,
    backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border,
  },
  filterBtnStatus: {
    paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20,
    backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border,
  },
  filterBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterBtnStatusActive: { backgroundColor: `${Colors.navy}`, borderColor: Colors.navy },
  filterText: { fontSize: 12, fontWeight: '600', color: Colors.textMuted },
  filterTextActive: { color: '#FFF' },

  // List
  listContent: { paddingTop: 8 },
  dateGroup: { marginBottom: 16 },
  dateLabel: {
    fontSize: 11, fontWeight: '700', color: Colors.textMuted,
    marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.8,
  },
  txRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.white, borderRadius: 16,
    padding: 14, marginBottom: 6, ...Shadows.sm,
  },
  txIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  txInfo: { flex: 1, gap: 3 },
  txName: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  txMeta: { fontSize: 11, color: Colors.textMuted },
  txRight: { alignItems: 'flex-end', gap: 4 },
  txAmount: { fontSize: 14, fontWeight: '800' },
  statusBadge: { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  statusText: { fontSize: 11, fontWeight: '700' },

  // Empty state
  emptyState: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyIcon: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: `${Colors.primary}10`,
    alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: Colors.textSecondary },
  emptySubtitle: { fontSize: 14, color: Colors.textMuted, textAlign: 'center' },
  resetBtn: {
    marginTop: 8, paddingVertical: 10, paddingHorizontal: 24,
    borderRadius: 12, borderWidth: 1.5, borderColor: Colors.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  resetBtnText: { fontSize: 14, fontWeight: '700', color: Colors.primary },
});
