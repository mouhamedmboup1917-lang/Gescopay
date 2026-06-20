import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Shadows } from '@/constants/Colors';
import { MOCK_INVOICES } from '@/constants/mockData';
import { formatCurrency, formatDate } from '@/lib/formatters';

const STATUS_COLORS: Record<string, string> = {
  paid: Colors.success,
  sent: Colors.primary,
  draft: Colors.muted,
  overdue: Colors.danger,
  cancelled: Colors.danger,
};

const STATUS_LABELS: Record<string, string> = {
  paid: 'Payé',
  sent: 'Envoyé',
  draft: 'Brouillon',
  overdue: 'En retard',
  cancelled: 'Annulé',
};

export default function InvoicesScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.navy} />
        </TouchableOpacity>
        <Text style={styles.title}>Factures</Text>
        <TouchableOpacity style={styles.addBtn}>
          <Ionicons name="add" size={22} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}>
        {MOCK_INVOICES.map((inv) => (
          <View key={inv.id} style={styles.invoiceCard}>
            <View style={styles.invoiceTop}>
              <View>
                <Text style={styles.invoiceNum}>#{inv.id.slice(-6).toUpperCase()}</Text>
                <Text style={styles.invoiceCustomer}>{inv.customerName}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: `${STATUS_COLORS[inv.status]}15` }]}>
                <Text style={[styles.statusText, { color: STATUS_COLORS[inv.status] }]}>
                  {STATUS_LABELS[inv.status]}
                </Text>
              </View>
            </View>
            <View style={styles.invoiceItems}>
              {inv.items.map((item, i) => (
                <Text key={i} style={styles.invoiceItem} numberOfLines={1}>
                  {item.quantity}× {item.description}
                </Text>
              ))}
            </View>
            <View style={styles.invoiceFooter}>
              <View>
                <Text style={styles.invoiceDue}>Échéance: {formatDate(inv.dueDate)}</Text>
                <Text style={styles.invoiceCreated}>Créée: {formatDate(inv.createdAt)}</Text>
              </View>
              <Text style={styles.invoiceTotal}>{formatCurrency(inv.total, inv.currency)}</Text>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.createInvoiceBtn}>
          <LinearGradient colors={['#00A8A8', '#007575']} style={styles.createInvoiceBtnInner}>
            <Ionicons name="add-circle-outline" size={20} color="#FFF" />
            <Text style={styles.createInvoiceBtnText}>Créer une facture</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center', ...Shadows.sm },
  title: { fontSize: 18, fontWeight: '800', color: Colors.navy },
  addBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.orange, alignItems: 'center', justifyContent: 'center' },
  scroll: { paddingHorizontal: 20, paddingTop: 8 },
  invoiceCard: { backgroundColor: Colors.white, borderRadius: 18, padding: 18, marginBottom: 14, ...Shadows.md },
  invoiceTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  invoiceNum: { fontSize: 15, fontWeight: '800', color: Colors.navy },
  invoiceCustomer: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  statusBadge: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5 },
  statusText: { fontSize: 12, fontWeight: '700' },
  invoiceItems: { gap: 4, marginBottom: 14, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: Colors.border },
  invoiceItem: { fontSize: 13, color: Colors.textSecondary },
  invoiceFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  invoiceDue: { fontSize: 12, color: Colors.textMuted },
  invoiceCreated: { fontSize: 11, color: Colors.textMuted },
  invoiceTotal: { fontSize: 20, fontWeight: '800', color: Colors.navy },
  createInvoiceBtn: { borderRadius: 16, overflow: 'hidden', marginTop: 8 },
  createInvoiceBtnInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 18 },
  createInvoiceBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
