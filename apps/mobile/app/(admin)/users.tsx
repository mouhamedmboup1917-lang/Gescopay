import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Shadows } from '@/constants/Colors';
import { MOCK_USERS } from '@/constants/mockData';

export default function AdminUsersScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.navy} />
        </TouchableOpacity>
        <Text style={styles.title}>Utilisateurs ({MOCK_USERS.length})</Text>
        <TouchableOpacity style={styles.exportBtn}>
          <Ionicons name="download-outline" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={MOCK_USERS}
        keyExtractor={(u) => u.id}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 40 }]}
        renderItem={({ item: user }) => (
          <View style={styles.userRow}>
            <View style={[styles.avatar, { backgroundColor: `${Colors.primary}25` }]}>
              <Text style={styles.avatarText}>{user.firstName[0]}{user.lastName[0]}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.firstName} {user.lastName}</Text>
              <Text style={styles.userEmail} numberOfLines={1}>{user.email}</Text>
              <Text style={styles.userPhone}>{user.phone}</Text>
            </View>
            <View style={styles.userRight}>
              <View style={[styles.kycBadge, { backgroundColor: user.kycStatus === 'verified' ? `${Colors.success}15` : `${Colors.warning}15` }]}>
                <Text style={[styles.kycText, { color: user.kycStatus === 'verified' ? Colors.success : Colors.warning }]}>
                  {user.kycStatus === 'verified' ? 'KYC ✓' : 'En attente'}
                </Text>
              </View>
              <Text style={styles.userCountry}>{user.country}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center', ...Shadows.sm },
  title: { fontSize: 16, fontWeight: '800', color: Colors.navy },
  exportBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: `${Colors.primary}15`, alignItems: 'center', justifyContent: 'center' },
  list: { paddingHorizontal: 20, paddingTop: 8 },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.white, borderRadius: 14, padding: 12, marginBottom: 8, ...Shadows.sm },
  avatar: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 16, fontWeight: '800', color: Colors.primary },
  userInfo: { flex: 1 },
  userName: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  userEmail: { fontSize: 11, color: Colors.textMuted },
  userPhone: { fontSize: 11, color: Colors.textMuted },
  userRight: { alignItems: 'flex-end', gap: 4 },
  kycBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  kycText: { fontSize: 10, fontWeight: '700' },
  userCountry: { fontSize: 11, color: Colors.textMuted },
});
