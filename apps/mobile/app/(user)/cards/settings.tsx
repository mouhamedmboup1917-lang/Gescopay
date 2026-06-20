import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Shadows } from '@/constants/Colors';
import { formatCurrency } from '@/lib/formatters';
import { T } from '@/constants/i18n';
import { PADDING_H, contentContainer, TS, TOUCH_MIN } from '@/constants/Responsive';

export default function CardSettingsScreen() {
  const insets = useSafeAreaInsets();
  
  // Settings state
  const [onlinePay, setOnlinePay] = useState(true);
  const [intlPay, setIntlPay] = useState(false);
  const [contactless, setContactless] = useState(true);
  const [atmWithdraw, setAtmWithdraw] = useState(false);
  const [limit, setLimit] = useState('500000'); // XOF
  const [tempLimit, setTempLimit] = useState('500000');
  const [isEditingLimit, setIsEditingLimit] = useState(false);

  const handleSaveLimit = () => {
    const num = parseInt(tempLimit, 10);
    if (isNaN(num) || num <= 0) {
      Alert.alert('Error', 'Please enter a valid spending limit greater than 0 XOF.');
      return;
    }
    setLimit(tempLimit);
    setIsEditingLimit(false);
  };

  const handleResetPin = () => {
    Alert.alert(
      'Reset Card PIN',
      'A temporary PIN code will be sent by SMS. Do you want to continue?',
      [
        { text: T.common.cancel, style: 'cancel' },
        { text: T.common.confirm, onPress: () => Alert.alert('Success', 'A new PIN has been sent successfully.') }
      ]
    );
  };

  const handleTerminateCard = () => {
    Alert.alert(
      'Terminate Card',
      'This action is irreversible. All linked payment authorizations will be cancelled.',
      [
        { text: T.common.cancel, style: 'cancel' },
        { text: 'Terminate', style: 'destructive', onPress: () => {
            Alert.alert('Terminated', 'Your virtual card has been terminated.');
            router.back();
          }
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} accessibilityLabel={T.common.back}>
          <Ionicons name="arrow-back" size={24} color={Colors.navy} />
        </TouchableOpacity>
        <Text style={styles.title}>{T.card.settings}</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}>
        <View style={contentContainer}>
          {/* Section: Plafond */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{T.card.spendingLimit}</Text>
            <View style={styles.card}>
              <View style={styles.limitHeader}>
                <View>
                  <Text style={styles.limitLabel}>Current Monthly Limit</Text>
                  <Text style={styles.limitValue}>{formatCurrency(parseInt(limit, 10), 'XOF')}</Text>
                </View>
                <TouchableOpacity
                  style={[styles.editBtn, { minHeight: TOUCH_MIN, justifyContent: 'center' }]}
                  onPress={() => {
                    if (isEditingLimit) {
                      handleSaveLimit();
                    } else {
                      setTempLimit(limit);
                      setIsEditingLimit(true);
                    }
                  }}
                >
                  <Text style={styles.editBtnText}>{isEditingLimit ? T.common.save : T.common.edit}</Text>
                </TouchableOpacity>
              </View>

              {isEditingLimit ? (
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={tempLimit}
                    onChangeText={setTempLimit}
                    keyboardType="numeric"
                    placeholder="Enter new limit"
                    autoFocus
                  />
                  <Text style={styles.currencyLabel}>XOF</Text>
                </View>
              ) : (
                <Text style={styles.limitHint}>
                  You can change your monthly spending limit at any time.
                </Text>
              )}
            </View>
          </View>

          {/* Section: Autorisations */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{T.card.securitySettings}</Text>
            <View style={styles.card}>
              {/* Online */}
              <View style={styles.switchRow}>
                <View style={styles.iconContainer}>
                  <Ionicons name="globe-outline" size={20} color={Colors.primary} />
                </View>
                <View style={styles.switchInfo}>
                  <Text style={styles.switchLabel}>{T.card.onlinePayments}</Text>
                  <Text style={styles.switchSublabel}>{T.card.onlinePaymentsSub}</Text>
                </View>
                <Switch
                  value={onlinePay}
                  onValueChange={setOnlinePay}
                  trackColor={{ true: Colors.primary, false: Colors.border }}
                  thumbColor="#FFFFFF"
                />
              </View>
              <View style={styles.divider} />

              {/* Intl */}
              <View style={styles.switchRow}>
                <View style={styles.iconContainer}>
                  <Ionicons name="airplane-outline" size={20} color={Colors.primary} />
                </View>
                <View style={styles.switchInfo}>
                  <Text style={styles.switchLabel}>{T.card.internationalPayments}</Text>
                  <Text style={styles.switchSublabel}>{T.card.internationalPaymentsSub}</Text>
                </View>
                <Switch
                  value={intlPay}
                  onValueChange={setIntlPay}
                  trackColor={{ true: Colors.primary, false: Colors.border }}
                  thumbColor="#FFFFFF"
                />
              </View>
              <View style={styles.divider} />

              {/* NFC */}
              <View style={styles.switchRow}>
                <View style={styles.iconContainer}>
                  <Ionicons name="wifi-outline" size={20} color={Colors.primary} />
                </View>
                <View style={styles.switchInfo}>
                  <Text style={styles.switchLabel}>{T.card.contactless}</Text>
                  <Text style={styles.switchSublabel}>{T.card.contactlessSub}</Text>
                </View>
                <Switch
                  value={contactless}
                  onValueChange={setContactless}
                  trackColor={{ true: Colors.primary, false: Colors.border }}
                  thumbColor="#FFFFFF"
                />
              </View>
              <View style={styles.divider} />

              {/* ATM */}
              <View style={styles.switchRow}>
                <View style={styles.iconContainer}>
                  <Ionicons name="cash-outline" size={20} color={Colors.primary} />
                </View>
                <View style={styles.switchInfo}>
                  <Text style={styles.switchLabel}>ATM Withdrawals</Text>
                  <Text style={styles.switchSublabel}>Allow cash withdrawals at ATM terminals</Text>
                </View>
                <Switch
                  value={atmWithdraw}
                  onValueChange={setAtmWithdraw}
                  trackColor={{ true: Colors.primary, false: Colors.border }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>
          </View>

          {/* Section: Actions de sécurité */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Card Management</Text>
            <View style={styles.card}>
              {/* Reset PIN */}
              <TouchableOpacity style={styles.actionRow} onPress={handleResetPin} accessibilityLabel="Reset PIN">
                <View style={[styles.iconContainer, { backgroundColor: `${Colors.warning}15` }]}>
                  <Ionicons name="key-outline" size={20} color={Colors.warning} />
                </View>
                <View style={styles.switchInfo}>
                  <Text style={styles.actionLabel}>Reset PIN Code</Text>
                  <Text style={styles.switchSublabel}>Change the physical security PIN of your card</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.muted} />
              </TouchableOpacity>
              <View style={styles.divider} />

              {/* Block / Terminate */}
              <TouchableOpacity style={styles.actionRow} onPress={handleTerminateCard} accessibilityLabel="Terminate Card">
                <View style={[styles.iconContainer, { backgroundColor: `${Colors.danger}15` }]}>
                  <Ionicons name="trash-outline" size={20} color={Colors.danger} />
                </View>
                <View style={styles.switchInfo}>
                  <Text style={[styles.actionLabel, { color: Colors.danger }]}>Terminate Card</Text>
                  <Text style={styles.switchSublabel}>Permanently cancel and delete this virtual card</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.muted} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
  },
  backBtn: {
    width: TOUCH_MIN,
    height: TOUCH_MIN,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: TS.h2, fontWeight: '800', color: Colors.navy },
  scroll: { paddingTop: 20 },
  
  // Section
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: Colors.textSecondary, marginBottom: 10, paddingLeft: 4 },
  
  // Card Container
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    ...Shadows.md,
  },

  // Limit header
  limitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  limitLabel: { fontSize: 13, color: Colors.textMuted },
  limitValue: { fontSize: 24, fontWeight: '800', color: Colors.navy, marginTop: 4 },
  editBtn: {
    backgroundColor: `${Colors.primary}15`,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  editBtnText: { color: Colors.primary, fontWeight: '700', fontSize: 13 },
  limitHint: { fontSize: 12, color: Colors.textSecondary, lineHeight: 18 },
  
  // Input
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 52,
    marginTop: 8,
  },
  input: { flex: 1, fontSize: 16, color: Colors.navy, fontWeight: '700' },
  currencyLabel: { fontSize: 15, fontWeight: '700', color: Colors.textSecondary },

  // Switches
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: `${Colors.primary}12`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  switchInfo: { flex: 1 },
  switchLabel: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  switchSublabel: { fontSize: 12, color: Colors.textMuted, marginTop: 2, lineHeight: 16 },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 4 },

  // Security action row
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  actionLabel: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
});
