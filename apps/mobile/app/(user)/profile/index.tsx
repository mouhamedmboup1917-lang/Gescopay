import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Shadows } from '@/constants/Colors';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { T } from '@/constants/i18n';
import { PADDING_H, TS, TOUCH_MIN, TOUCH_SM } from '@/constants/Responsive';

interface MenuItem {
  icon: string;
  label: string;
  sublabel: string;
  color: string;
  route?: string;
  isToggle?: boolean;
  isDark?: boolean;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const MENU_SECTIONS: MenuSection[] = [
  {
    title: T.profile.sections.myAccount,
    items: [
      { icon: 'person-outline',          label: T.profile.items.personalInfo,   sublabel: T.profile.items.personalInfoSub,   color: Colors.primary },
      { icon: 'shield-checkmark-outline',label: T.profile.items.kyc,            sublabel: T.profile.items.kycSub,           color: Colors.success },
      { icon: 'card-outline',            label: T.profile.items.myCards,        sublabel: T.profile.items.myCardsSub,        color: '#8B5CF6', route: '/(user)/cards' },
      { icon: 'wallet-outline',          label: T.profile.items.myWallets,      sublabel: T.profile.items.myWalletsSub,      color: Colors.orange, route: '/(user)/wallets/index' },
    ],
  },
  {
    title: T.profile.sections.security,
    items: [
      { icon: 'keypad-outline',          label: T.profile.items.changePin,      sublabel: T.profile.items.changePinSub,      color: Colors.navy },
      { icon: 'finger-print-outline',    label: T.profile.items.biometrics,     sublabel: T.profile.items.biometricsSub,     color: '#3B82F6', isToggle: true },
      { icon: 'phone-portrait-outline',  label: T.profile.items.devices,        sublabel: T.profile.items.devicesSub,        color: '#EC4899' },
      { icon: 'time-outline',            label: T.profile.items.loginHistory,   sublabel: T.profile.items.loginHistorySub,   color: Colors.warning },
      { icon: 'lock-closed-outline',     label: T.profile.items.twoFa,          sublabel: T.profile.items.twoFaSub,          color: Colors.success, isToggle: true },
    ],
  },
  {
    title: T.profile.sections.preferences,
    items: [
      { icon: 'notifications-outline',   label: T.profile.items.notifications,  sublabel: T.profile.items.notificationsSub,  color: Colors.primary },
      { icon: 'language-outline',        label: T.profile.items.language,        sublabel: T.profile.items.languageSub,       color: '#3B82F6' },
      { icon: 'moon-outline',            label: T.profile.items.darkMode,        sublabel: T.profile.items.darkModeSub,       color: Colors.navy, isToggle: true, isDark: true },
    ],
  },
  {
    title: T.profile.sections.support,
    items: [
      { icon: 'help-circle-outline',     label: T.profile.items.helpCenter,     sublabel: T.profile.items.helpCenterSub,     color: Colors.primary },
      { icon: 'chatbubble-outline',      label: T.profile.items.chatSupport,    sublabel: T.profile.items.chatSupportSub,    color: Colors.success },
      { icon: 'document-text-outline',   label: T.profile.items.terms,          sublabel: '',                               color: Colors.muted },
      { icon: 'information-circle-outline', label: T.profile.items.about,       sublabel: T.profile.items.aboutSub,         color: Colors.muted },
    ],
  },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useUIStore();
  const [biometricsEnabled, setBiometricsEnabled] = useState(user?.isBiometricsEnabled ?? false);
  const [twoFaEnabled, setTwoFaEnabled] = useState(user?.twoFactorEnabled ?? false);
  const isDark = theme === 'dark';

  const handleLogout = () => {
    Alert.alert(
      T.profile.logoutTitle,
      T.profile.logoutConfirm,
      [
        { text: T.profile.logoutCancel, style: 'cancel' },
        {
          text: T.profile.logoutAction,
          style: 'destructive',
          onPress: () => { logout(); router.replace('/(auth)/welcome'); },
        },
      ]
    );
  };

  const getToggleValue = (item: MenuItem) => {
    if (item.isDark) return isDark;
    if (item.icon === 'finger-print-outline') return biometricsEnabled;
    if (item.icon === 'lock-closed-outline') return twoFaEnabled;
    return false;
  };

  const handleToggle = (item: MenuItem, value: boolean) => {
    if (item.isDark) { setTheme(value ? 'dark' : 'light'); return; }
    if (item.icon === 'finger-print-outline') { setBiometricsEnabled(value); return; }
    if (item.icon === 'lock-closed-outline') { setTwoFaEnabled(value); return; }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 110 }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{T.profile.title}</Text>
          <TouchableOpacity
            style={styles.settingsBtn}
            accessibilityLabel={T.common.settings}
            accessibilityRole="button"
          >
            <Ionicons name="settings-outline" size={22} color={Colors.navy} />
          </TouchableOpacity>
        </View>

        {/* Profile card */}
        <LinearGradient
          colors={['#0A2342', '#143567']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.profileCard}
        >
          <View style={styles.blob1} />
          <View style={styles.blob2} />

          <View style={styles.profileTop}>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </Text>
              </View>
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark" size={10} color="#FFF" />
              </View>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.firstName} {user?.lastName}</Text>
              <Text style={styles.profileEmail}>{user?.email}</Text>
              <View style={styles.kycBadge}>
                <Ionicons name="shield-checkmark-outline" size={12} color={Colors.success} />
                <Text style={styles.kycText}>{T.profile.verified}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.editBtn} accessibilityLabel="Edit profile">
              <Ionicons name="pencil-outline" size={16} color="rgba(255,255,255,0.8)" />
            </TouchableOpacity>
          </View>

          {/* Stats row */}
          <View style={styles.profileStats}>
            <View style={styles.profileStat}>
              <Text style={styles.profileStatValue}>3</Text>
              <Text style={styles.profileStatLabel}>Wallets</Text>
            </View>
            <View style={styles.profileStatDivider} />
            <View style={styles.profileStat}>
              <Text style={styles.profileStatValue}>1</Text>
              <Text style={styles.profileStatLabel}>Card</Text>
            </View>
            <View style={styles.profileStatDivider} />
            <View style={styles.profileStat}>
              <Text style={styles.profileStatValue}>48</Text>
              <Text style={styles.profileStatLabel}>Transactions</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Menu sections */}
        {MENU_SECTIONS.map((section) => (
          <View key={section.title} style={styles.menuSection}>
            <Text style={styles.menuSectionTitle}>{section.title}</Text>
            <View style={styles.menuCard}>
              {section.items.map((item, i) => (
                <View key={item.label}>
                  <TouchableOpacity
                    style={styles.menuRow}
                    onPress={() => item.route ? router.push(item.route as any) : undefined}
                    activeOpacity={item.isToggle ? 1 : 0.7}
                    accessibilityLabel={item.label}
                    accessibilityRole={item.isToggle ? 'switch' : 'button'}
                  >
                    <View style={[styles.menuIcon, { backgroundColor: `${item.color}15` }]}>
                      <Ionicons name={item.icon as any} size={18} color={item.color} />
                    </View>
                    <View style={styles.menuInfo}>
                      <Text style={styles.menuLabel}>{item.label}</Text>
                      {item.sublabel ? <Text style={styles.menuSublabel}>{item.sublabel}</Text> : null}
                    </View>
                    {item.isToggle ? (
                      <Switch
                        value={getToggleValue(item)}
                        onValueChange={(v) => handleToggle(item, v)}
                        trackColor={{ true: Colors.primary, false: Colors.border }}
                        thumbColor="#FFFFFF"
                        accessibilityLabel={item.label}
                      />
                    ) : (
                      <Ionicons name="chevron-forward" size={16} color={Colors.muted} />
                    )}
                  </TouchableOpacity>
                  {i < section.items.length - 1 && <View style={styles.menuDivider} />}
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Log Out */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          accessibilityLabel={T.profile.logout}
          accessibilityRole="button"
        >
          <Ionicons name="log-out-outline" size={20} color={Colors.danger} />
          <Text style={styles.logoutText}>{T.profile.logout}</Text>
        </TouchableOpacity>

        <Text style={styles.version}>{T.profile.items.aboutSub}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: PADDING_H, paddingTop: 12 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: TS.h1, fontWeight: '800', color: Colors.navy },
  settingsBtn: {
    width: TOUCH_MIN, height: TOUCH_MIN, borderRadius: 12,
    backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center', ...Shadows.sm,
  },

  // Profile card
  profileCard: { borderRadius: 24, padding: 24, marginBottom: 28, overflow: 'hidden', ...Shadows.card },
  blob1: { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.04)', top: -60, right: -60 },
  blob2: { position: 'absolute', width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(0,168,168,0.1)', bottom: -20, left: 20 },
  profileTop: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20 },
  avatarWrapper: { position: 'relative' },
  avatar: { width: 64, height: 64, borderRadius: 20, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 22, fontWeight: '800', color: '#FFF' },
  verifiedBadge: {
    position: 'absolute', bottom: -2, right: -2,
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: Colors.success, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.navy,
  },
  profileInfo: { flex: 1 },
  profileName: { fontSize: TS.h3, fontWeight: '800', color: '#FFF', marginBottom: 3 },
  profileEmail: { fontSize: TS.sm, color: 'rgba(255,255,255,0.55)', marginBottom: 6 },
  kycBadge: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  kycText: { fontSize: 11, fontWeight: '700', color: Colors.success },
  editBtn: {
    width: TOUCH_SM, height: TOUCH_SM, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center',
  },
  profileStats: {
    flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16, padding: 16, alignItems: 'center',
  },
  profileStat: { flex: 1, alignItems: 'center' },
  profileStatValue: { fontSize: TS.h2, fontWeight: '800', color: '#FFF', marginBottom: 2 },
  profileStatLabel: { fontSize: TS.xs, color: 'rgba(255,255,255,0.5)', fontWeight: '600' },
  profileStatDivider: { width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.15)' },

  // Menu
  menuSection: { marginBottom: 24 },
  menuSectionTitle: { fontSize: TS.xs, fontWeight: '700', color: Colors.textMuted, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 },
  menuCard: { backgroundColor: Colors.white, borderRadius: 20, padding: 4, ...Shadows.md },
  menuRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingHorizontal: 16, paddingVertical: 14,
    minHeight: TOUCH_MIN,
  },
  menuIcon: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  menuInfo: { flex: 1 },
  menuLabel: { fontSize: TS.body, fontWeight: '700', color: Colors.textPrimary },
  menuSublabel: { fontSize: TS.sm, color: Colors.textMuted, marginTop: 2 },
  menuDivider: { height: 1, backgroundColor: Colors.border, marginHorizontal: 16 },

  // Logout
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: `${Colors.danger}10`, borderRadius: 16,
    paddingVertical: 16, borderWidth: 1, borderColor: `${Colors.danger}25`,
    marginBottom: 20, minHeight: TOUCH_MIN,
  },
  logoutText: { fontSize: TS.h3, fontWeight: '700', color: Colors.danger },
  version: { textAlign: 'center', fontSize: TS.xs, color: Colors.textMuted, marginBottom: 8 },
});
