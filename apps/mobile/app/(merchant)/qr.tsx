import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Shadows } from '@/constants/Colors';
import { CURRENT_MERCHANT } from '@/constants/mockData';
import QRCode from 'react-native-qrcode-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { formatCurrency } from '@/lib/formatters';
import { Dimensions, Share } from 'react-native';

const { width } = Dimensions.get('window');

export default function MerchantQRScreen() {
  const insets = useSafeAreaInsets();
  const qrData = JSON.stringify({ type: 'gescopay_merchant', merchantId: CURRENT_MERCHANT.id, name: CURRENT_MERCHANT.businessName });
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.navy} />
        </TouchableOpacity>
        <Text style={styles.title}>Mon QR Marchand</Text>
        <TouchableOpacity onPress={() => Share.share({ message: `Payer ${CURRENT_MERCHANT.businessName} via GescoPay` })}>
          <Ionicons name="share-outline" size={22} color={Colors.navy} />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}>
        <View style={styles.qrCard}>
          <LinearGradient colors={['#0A2342', '#143567']} style={styles.qrTop}>
            <View style={styles.merchantInfo}>
              <View style={styles.merchantAvatar}>
                <Ionicons name="storefront" size={24} color="#FFF" />
              </View>
              <View>
                <Text style={styles.merchantName}>{CURRENT_MERCHANT.businessName}</Text>
                <Text style={styles.merchantType}>{CURRENT_MERCHANT.businessType}</Text>
              </View>
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
              </View>
            </View>
          </LinearGradient>
          <View style={styles.qrBody}>
            <View style={styles.qrWrapper}>
              <QRCode value={qrData} size={width - 120} color={Colors.navy} backgroundColor="white" />
            </View>
            <Text style={styles.qrHint}>Scannez pour payer</Text>
            <Text style={styles.qrId}>ID: {CURRENT_MERCHANT.id.slice(-12).toUpperCase()}</Text>
          </View>
          <View style={styles.qrFooter}>
            <Text style={styles.poweredBy}>Propulsé par <Text style={{ color: Colors.primary, fontWeight: '800' }}>GescoPay</Text></Text>
          </View>
        </View>
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn}><Ionicons name="download-outline" size={18} color={Colors.primary} /><Text style={styles.actionText}>Enregistrer</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: Colors.primary, borderColor: Colors.primary }]} onPress={() => Share.share({ message: `Payer ${CURRENT_MERCHANT.businessName} via GescoPay` })}>
            <Ionicons name="share-outline" size={18} color="#FFF" /><Text style={[styles.actionText, { color: '#FFF' }]}>Partager</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}><Ionicons name="print-outline" size={18} color={Colors.primary} /><Text style={styles.actionText}>Imprimer</Text></TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center', ...Shadows.sm },
  title: { fontSize: 18, fontWeight: '800', color: Colors.navy },
  scroll: { paddingHorizontal: 20 },
  qrCard: { backgroundColor: Colors.white, borderRadius: 24, overflow: 'hidden', marginBottom: 20, ...Shadows.lg },
  qrTop: { padding: 20 },
  merchantInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  merchantAvatar: { width: 48, height: 48, borderRadius: 14, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  merchantName: { fontSize: 16, fontWeight: '800', color: '#FFF' },
  merchantType: { fontSize: 12, color: 'rgba(255,255,255,0.6)' },
  verifiedBadge: { marginLeft: 'auto' },
  qrBody: { padding: 24, alignItems: 'center', gap: 14 },
  qrWrapper: { padding: 16, backgroundColor: '#FFF', borderRadius: 16, ...Shadows.sm },
  qrHint: { fontSize: 14, color: Colors.textSecondary, fontWeight: '600' },
  qrId: { fontSize: 12, color: Colors.textMuted, fontFamily: 'monospace' },
  qrFooter: { padding: 16, alignItems: 'center', borderTopWidth: 1, borderTopColor: Colors.border },
  poweredBy: { fontSize: 12, color: Colors.textMuted },
  actionsRow: { flexDirection: 'row', gap: 10 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: Colors.white, borderRadius: 14, paddingVertical: 14, borderWidth: 1, borderColor: `${Colors.primary}30`, ...Shadows.sm },
  actionText: { fontSize: 12, fontWeight: '700', color: Colors.primary },
});
