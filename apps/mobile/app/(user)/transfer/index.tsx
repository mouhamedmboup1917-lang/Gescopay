import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Shadows } from '@/constants/Colors';
import { MOCK_WALLETS, MOCK_USERS } from '@/constants/mockData';
import { formatCurrency } from '@/lib/formatters';
import { T } from '@/constants/i18n';
import { PADDING_H, contentContainer, TS, TOUCH_MIN } from '@/constants/Responsive';

const RECENT_CONTACTS = MOCK_USERS.slice(0, 6).map((u) => ({
  id: u.id,
  name: `${u.firstName} ${u.lastName}`,
  phone: u.phone,
  initials: `${u.firstName[0]}${u.lastName[0]}`,
  color: ['#00A8A8', '#FF7A00', '#3B82F6', '#8B5CF6', '#22C55E', '#EC4899'][
    Math.floor(Math.random() * 6)
  ],
}));

export default function TransferScreen() {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<'recipient' | 'amount' | 'confirm' | 'success'>('recipient');
  const [selectedContact, setSelectedContact] = useState<typeof RECENT_CONTACTS[0] | null>(null);
  const [amount, setAmount] = useState('');
  const [selectedWallet, setSelectedWallet] = useState(MOCK_WALLETS[0]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsLoading(false);
    setStep('success');
  };

  const stepsList = useMemo(() => ['recipient', 'amount', 'confirm'], []);

  if (step === 'success') {
    return (
      <View style={[styles.successContainer, { paddingTop: insets.top }]}>
        <LinearGradient colors={['#0A2342', '#143567']} style={StyleSheet.absoluteFill} />
        <View style={[styles.successContent, contentContainer]}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark" size={48} color="#FFF" />
          </View>
          <Text style={styles.successTitle}>{T.transfer.success.title}</Text>
          <Text style={styles.successAmount}>{formatCurrency(Number(amount), 'XOF')}</Text>
          <Text style={styles.successTo}>{T.transfer.success.sentTo(selectedContact?.name ?? T.transfer.unknown)}</Text>
          <View style={styles.receiptCard}>
            {[
              { label: T.transfer.success.reference, value: `GP-${Date.now().toString(36).toUpperCase()}` },
              { label: T.transfer.from, value: selectedWallet.providerInfo.name },
              { label: T.transfer.success.fee, value: formatCurrency(Math.round(Number(amount) * 0.01), 'XOF') },
              { label: T.transfer.success.date, value: new Date().toLocaleString('en-US') },
            ].map((row) => (
              <View key={row.label} style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>{row.label}</Text>
                <Text style={styles.receiptValue}>{row.value}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity
            style={[styles.successBtn, { minHeight: TOUCH_MIN, justifyContent: 'center' }]}
            onPress={() => { setStep('recipient'); setAmount(''); setSelectedContact(null); router.back(); }}
          >
            <Text style={styles.successBtnText}>{T.transfer.success.backHome}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (step === 'recipient') router.back();
            else if (step === 'amount') setStep('recipient');
            else if (step === 'confirm') setStep('amount');
          }}
          style={[styles.backBtn, { minHeight: TOUCH_MIN }]}
          accessibilityLabel={T.common.back}
        >
          <Ionicons name="arrow-back" size={22} color={Colors.navy} />
        </TouchableOpacity>
        <Text style={styles.title}>
          {step === 'recipient' ? T.transfer.title : step === 'amount' ? T.transfer.titleAmount : T.transfer.titleConfirm}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Step indicators */}
      <View style={styles.steps}>
        {stepsList.map((s, i) => (
          <React.Fragment key={s}>
            <View style={[styles.stepDot, step === s || (s === 'recipient' && step !== 'recipient') || (s === 'amount' && step === 'confirm') ? styles.stepDotActive : {}]} >
              {step === s ? (
                <View style={styles.stepDotInner} />
              ) : (
                <Ionicons name="checkmark" size={10} color="#FFF" />
              )}
            </View>
            {i < 2 && (
              <View style={[styles.stepLine, i < stepsList.indexOf(step) ? styles.stepLineActive : {}]} />
            )}
          </React.Fragment>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}>
        <View style={contentContainer}>
          {/* STEP 1: RECIPIENT */}
          {step === 'recipient' && (
            <View style={styles.stepContent}>
              {/* Search */}
              <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={18} color={Colors.muted} style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder={T.transfer.searchPlaceholder}
                  placeholderTextColor={Colors.muted}
                  value={search}
                  onChangeText={setSearch}
                />
                <TouchableOpacity style={[styles.scanBtn, { minHeight: TOUCH_MIN, justifyContent: 'center' }]} onPress={() => router.push('/(user)/qr/scan')}>
                  <Ionicons name="scan-outline" size={18} color={Colors.primary} />
                </TouchableOpacity>
              </View>

              {/* Recent contacts */}
              <Text style={styles.sectionTitle}>{T.transfer.recentContacts}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.contactsScroll} contentContainerStyle={{ gap: 14 }}>
                {RECENT_CONTACTS.map((contact) => (
                  <TouchableOpacity
                    key={contact.id}
                    style={styles.contactItem}
                    onPress={() => { setSelectedContact(contact); setStep('amount'); }}
                  >
                    <View style={[styles.contactAvatar, { backgroundColor: contact.color }]}>
                      <Text style={styles.contactInitials}>{contact.initials}</Text>
                    </View>
                    <Text style={styles.contactName} numberOfLines={1}>{contact.name.split(' ')[0]}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Transfer options */}
              <Text style={styles.sectionTitle}>{T.transfer.transferOptions}</Text>
              {[
                { icon: 'wallet-outline', title: T.transfer.mobileWallet, subtitle: T.transfer.mobileWalletSub, color: Colors.primary },
                { icon: 'card-outline', title: T.transfer.bankAccount, subtitle: T.transfer.bankAccountSub, color: '#3B82F6' },
                { icon: 'phone-portrait-outline', title: T.transfer.phoneNumber, subtitle: T.transfer.phoneNumberSub, color: Colors.orange },
              ].map((option) => (
                <TouchableOpacity
                  key={option.title}
                  style={[styles.transferOption, { minHeight: TOUCH_MIN }]}
                  onPress={() => setStep('amount')}
                >
                  <View style={[styles.optionIcon, { backgroundColor: `${option.color}15` }]}>
                    <Ionicons name={option.icon as any} size={22} color={option.color} />
                  </View>
                  <View style={styles.optionInfo}>
                    <Text style={styles.optionTitle}>{option.title}</Text>
                    <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={Colors.muted} />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* STEP 2: AMOUNT */}
          {step === 'amount' && (
            <View style={styles.stepContent}>
              {/* Recipient pill */}
              {selectedContact && (
                <View style={styles.recipientPill}>
                  <View style={[styles.pillAvatar, { backgroundColor: selectedContact.color }]}>
                    <Text style={styles.pillInitials}>{selectedContact.initials}</Text>
                  </View>
                  <View>
                    <Text style={styles.pillName}>{selectedContact.name}</Text>
                    <Text style={styles.pillPhone}>{selectedContact.phone}</Text>
                  </View>
                </View>
              )}

              {/* Amount input */}
              <View style={styles.amountContainer}>
                <Text style={styles.currencySymbol}>{T.transfer.amountCurrency}</Text>
                <TextInput
                  style={styles.amountInput}
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor="rgba(10,35,66,0.2)"
                  autoFocus
                />
              </View>

              {/* Quick amounts */}
              <View style={styles.quickAmounts}>
                {[1000, 2500, 5000, 10000, 25000, 50000].map((a) => (
                  <TouchableOpacity key={a} style={[styles.quickAmountBtn, { minHeight: TOUCH_MIN, justifyContent: 'center' }]} onPress={() => setAmount(String(a))}>
                    <Text style={styles.quickAmountText}>{formatCurrency(a, 'XOF', true)}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Wallet selector */}
              <Text style={styles.sectionTitle}>{T.transfer.from}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
                {MOCK_WALLETS.map((w) => (
                  <TouchableOpacity
                    key={w.id}
                    style={[styles.walletOption, selectedWallet.id === w.id && styles.walletOptionActive, { minHeight: TOUCH_MIN }]}
                    onPress={() => setSelectedWallet(w)}
                  >
                    <View style={[styles.walletOptionDot, { backgroundColor: w.providerInfo.color }]} />
                    <View>
                      <Text style={[styles.walletOptionName, selectedWallet.id === w.id && { color: Colors.primary }]}>
                        {w.providerInfo.shortName}
                      </Text>
                      <Text style={styles.walletOptionBal}>{formatCurrency(w.balance, 'XOF', true)}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <TouchableOpacity
                style={[styles.continueBtn, !amount && styles.continueBtnDisabled, { minHeight: TOUCH_MIN }]}
                onPress={() => amount && setStep('confirm')}
                disabled={!amount}
              >
                <LinearGradient
                  colors={amount ? ['#00A8A8', '#007575'] : [Colors.border, Colors.border]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.continueGradient}
                >
                  <Text style={styles.continueBtnText}>{T.common.continue}</Text>
                  <Ionicons name="arrow-forward" size={20} color="#FFF" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          {/* STEP 3: CONFIRM */}
          {step === 'confirm' && (
            <View style={styles.stepContent}>
              <View style={styles.confirmCard}>
                <View style={styles.confirmAmount}>
                  <Text style={styles.confirmAmountValue}>{formatCurrency(Number(amount), 'XOF')}</Text>
                  <Text style={styles.confirmAmountLabel}>{T.transfer.titleAmount}</Text>
                </View>
                <View style={styles.confirmDivider} />
                {[
                  { label: T.transfer.recipient, value: selectedContact?.name ?? T.transfer.unknown },
                  { label: T.transfer.phone, value: selectedContact?.phone ?? '-' },
                  { label: T.transfer.from, value: selectedWallet.providerInfo.name },
                  { label: T.transfer.fee, value: formatCurrency(Math.round(Number(amount) * 0.01), 'XOF') },
                  { label: T.transfer.totalDebited, value: formatCurrency(Number(amount) * 1.01, 'XOF') },
                ].map((row) => (
                  <View key={row.label} style={styles.confirmRow}>
                    <Text style={styles.confirmLabel}>{row.label}</Text>
                    <Text style={[styles.confirmValue, row.label === T.transfer.totalDebited && { color: Colors.danger, fontWeight: '800' }]}>
                      {row.value}
                    </Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity onPress={handleSend} disabled={isLoading} style={{ minHeight: TOUCH_MIN }}>
                <LinearGradient
                  colors={['#00A8A8', '#007575']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.sendBtn}
                >
                  {isLoading ? (
                    <Text style={styles.sendBtnText}>{T.common.processing}</Text>
                  ) : (
                    <>
                      <Ionicons name="send" size={18} color="#FFF" />
                      <Text style={styles.sendBtnText}>{T.transfer.confirmSend}</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.pinHint}>
                <Ionicons name="lock-closed-outline" size={14} color={Colors.muted} />
                <Text style={styles.pinHintText}>{T.transfer.pinHint}</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  backBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center', ...Shadows.sm,
  },
  title: { fontSize: TS.h2, fontWeight: '800', color: Colors.navy },
  steps: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 0, paddingHorizontal: 60, marginBottom: 24 },
  stepDot: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: Colors.border, alignItems: 'center', justifyContent: 'center',
  },
  stepDotActive: { backgroundColor: Colors.primary },
  stepDotInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FFF' },
  stepLine: { flex: 1, height: 2, backgroundColor: Colors.border },
  stepLineActive: { backgroundColor: Colors.primary },
  scroll: { paddingTop: 12 },
  stepContent: { gap: 20 },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, borderRadius: 14,
    paddingHorizontal: 16, ...Shadows.sm,
    borderWidth: 1, borderColor: Colors.border,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, height: 50, color: Colors.textPrimary, fontSize: 15 },
  scanBtn: { padding: 4 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.navy },
  contactsScroll: {},
  contactItem: { alignItems: 'center', gap: 6, width: 64 },
  contactAvatar: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  contactInitials: { fontSize: 18, fontWeight: '800', color: '#FFF' },
  contactName: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary, textAlign: 'center' },
  transferOption: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: Colors.white, borderRadius: 16, padding: 16, ...Shadows.sm,
  },
  optionIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  optionInfo: { flex: 1 },
  optionTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  optionSubtitle: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  recipientPill: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.white, borderRadius: 16, padding: 16, ...Shadows.sm,
  },
  pillAvatar: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  pillInitials: { fontSize: 16, fontWeight: '800', color: '#FFF' },
  pillName: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  pillPhone: { fontSize: 13, color: Colors.textMuted },
  amountContainer: { alignItems: 'center', paddingVertical: 20 },
  currencySymbol: { fontSize: 16, color: Colors.muted, fontWeight: '600', marginBottom: 8 },
  amountInput: { fontSize: 56, fontWeight: '800', color: Colors.navy, textAlign: 'center', minWidth: 100 },
  quickAmounts: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  quickAmountBtn: {
    paddingVertical: 8, paddingHorizontal: 14,
    backgroundColor: Colors.white, borderRadius: 10,
    borderWidth: 1, borderColor: Colors.border, ...Shadows.sm,
  },
  quickAmountText: { fontSize: 13, fontWeight: '700', color: Colors.textSecondary },
  walletOption: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.white, borderRadius: 14,
    paddingVertical: 12, paddingHorizontal: 16, ...Shadows.sm,
    borderWidth: 1.5, borderColor: 'transparent',
  },
  walletOptionActive: { borderColor: Colors.primary, backgroundColor: `${Colors.primary}08` },
  walletOptionDot: { width: 10, height: 10, borderRadius: 5 },
  walletOptionName: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  walletOptionBal: { fontSize: 12, color: Colors.textMuted },
  continueBtn: { borderRadius: 16, overflow: 'hidden' },
  continueBtnDisabled: { opacity: 0.5 },
  continueGradient: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 18,
  },
  continueBtnText: { color: '#FFF', fontSize: 17, fontWeight: '700' },
  confirmCard: {
    backgroundColor: Colors.white, borderRadius: 20, overflow: 'hidden', ...Shadows.md,
  },
  confirmAmount: { padding: 28, alignItems: 'center', backgroundColor: Colors.navy },
  confirmAmountValue: { fontSize: 36, fontWeight: '800', color: '#FFF', marginBottom: 4 },
  confirmAmountLabel: { fontSize: 14, color: 'rgba(255,255,255,0.6)' },
  confirmDivider: { height: 1, backgroundColor: Colors.border },
  confirmRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  confirmLabel: { fontSize: 14, color: Colors.textSecondary },
  confirmValue: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  sendBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, borderRadius: 16, paddingVertical: 18,
  },
  sendBtnText: { color: '#FFF', fontSize: 17, fontWeight: '700' },
  pinHint: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 12 },
  pinHintText: { fontSize: 13, color: Colors.muted },
  // Success
  successContainer: { flex: 1 },
  successContent: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  successIcon: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: Colors.success, alignItems: 'center', justifyContent: 'center', marginBottom: 24,
    shadowColor: Colors.success, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 20, elevation: 10,
  },
  successTitle: { fontSize: 28, fontWeight: '800', color: '#FFF', marginBottom: 12 },
  successAmount: { fontSize: 40, fontWeight: '800', color: '#FFF', marginBottom: 4 },
  successTo: { fontSize: 16, color: 'rgba(255,255,255,0.6)', marginBottom: 32 },
  receiptCard: { width: '100%', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: 20, gap: 12, marginBottom: 32 },
  receiptRow: { flexDirection: 'row', justifyContent: 'space-between' },
  receiptLabel: { fontSize: 13, color: 'rgba(255,255,255,0.5)' },
  receiptValue: { fontSize: 13, fontWeight: '700', color: '#FFF' },
  successBtn: {
    width: '100%', backgroundColor: Colors.primary, borderRadius: 16, paddingVertical: 18, alignItems: 'center',
  },
  successBtnText: { color: '#FFF', fontSize: 17, fontWeight: '700' },
});
