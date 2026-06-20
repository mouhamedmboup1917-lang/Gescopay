import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { BlurView } from 'expo-blur';
import { T } from '@/constants/i18n';
import { isTablet, TOUCH_LG } from '@/constants/Responsive';

function TabBarIcon({ name, focused, label }: { name: any; focused: boolean; label: string }) {
  return (
    <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
      <Ionicons name={name} size={isTablet ? 24 : 22} color={focused ? Colors.primary : Colors.muted} />
      {focused && <View style={styles.activeDot} />}
    </View>
  );
}

export default function UserLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () =>
          Platform.OS === 'ios' ? (
            <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
          ) : (
            <View style={[StyleSheet.absoluteFill, styles.tabBarBg]} />
          ),
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.tabLabel,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.muted,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: T.nav.home,
          tabBarIcon: ({ focused }) => <TabBarIcon name={focused ? 'home' : 'home-outline'} focused={focused} label={T.nav.home} />,
        }}
      />
      <Tabs.Screen
        name="wallets/index"
        options={{
          title: T.nav.wallets,
          tabBarIcon: ({ focused }) => <TabBarIcon name={focused ? 'wallet' : 'wallet-outline'} focused={focused} label={T.nav.wallets} />,
        }}
      />
      {/* ── Central QR Button ── */}
      <Tabs.Screen
        name="qr/display"
        options={{
          title: T.nav.qr,
          tabBarIcon: ({ focused }) => (
            <View style={[styles.qrButton, focused && styles.qrButtonActive]}>
              <Ionicons name="qr-code" size={26} color="#FFFFFF" />
            </View>
          ),
          tabBarLabel: () => (
            <Text style={styles.qrLabel}>{T.nav.qr}</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="transactions/index"
        options={{
          title: T.nav.activity,
          tabBarIcon: ({ focused }) => <TabBarIcon name={focused ? 'receipt' : 'receipt-outline'} focused={focused} label={T.nav.activity} />,
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: T.nav.profile,
          tabBarIcon: ({ focused }) => <TabBarIcon name={focused ? 'person' : 'person-outline'} focused={focused} label={T.nav.profile} />,
        }}
      />
      {/* Hidden screens */}
      <Tabs.Screen name="cards/index"         options={{ href: null }} />
      <Tabs.Screen name="cards/settings"      options={{ href: null }} />
      <Tabs.Screen name="transfer/index"      options={{ href: null }} />
      <Tabs.Screen name="wallets/add"         options={{ href: null }} />
      <Tabs.Screen name="qr/scan"             options={{ href: null }} />
      <Tabs.Screen name="transactions/[id]"   options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    borderTopWidth: 0,
    elevation: 0,
    height: Platform.OS === 'ios' ? 88 : isTablet ? 80 : 70,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    paddingTop: 10,
    backgroundColor: 'transparent',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  tabBarBg: {
    backgroundColor: 'rgba(255,255,255,0.98)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  qrLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    marginTop: 2,
  },
  iconWrapper: {
    width: 44,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  iconWrapperActive: {
    backgroundColor: 'rgba(0,168,168,0.1)',
  },
  activeDot: {
    position: 'absolute',
    bottom: -5,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },
  qrButton: {
    width: TOUCH_LG,
    height: TOUCH_LG,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  qrButtonActive: {
    backgroundColor: Colors.primaryDark,
    transform: [{ scale: 0.95 }],
  },
});
