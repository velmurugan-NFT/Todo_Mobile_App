import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { logout } from '../store/slices/authSlice';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../utils/theme';

export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { stats } = useSelector((state) => state.todos);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => dispatch(logout()) },
    ]);
  };

  const statItems = [
    { label: 'Total', value: stats?.total || 0, icon: 'list', color: COLORS.primary },
    { label: 'Done', value: stats?.completed || 0, icon: 'checkmark-circle', color: COLORS.success },
    { label: 'Pending', value: stats?.pending || 0, icon: 'time', color: COLORS.warning },
    { label: 'Overdue', value: stats?.overdue || 0, icon: 'alert-circle', color: COLORS.danger },
  ];

  const menuItems = [
    { icon: 'person-outline', label: 'Edit Profile', onPress: () => {} },
    { icon: 'lock-closed-outline', label: 'Change Password', onPress: () => {} },
    { icon: 'notifications-outline', label: 'Notifications', onPress: () => {} },
    { icon: 'color-palette-outline', label: 'Appearance', onPress: () => {} },
    { icon: 'help-circle-outline', label: 'Help & Support', onPress: () => {} },
    { icon: 'information-circle-outline', label: 'About', onPress: () => {} },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#16213e', '#0f0f1a']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Avatar & Name */}
        <View style={styles.profileSection}>
          <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0)?.toUpperCase()}</Text>
          </LinearGradient>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <Text style={styles.joinDate}>
            Member since {new Date(user?.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsGrid}>
          {statItems.map(({ label, value, icon, color }) => (
            <View key={label} style={styles.statCard}>
              <Ionicons name={icon} size={24} color={color} />
              <Text style={[styles.statValue, { color }]}>{value}</Text>
              <Text style={styles.statLabel}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Menu */}
        <View style={styles.menuSection}>
          {menuItems.map(({ icon, label, onPress }) => (
            <TouchableOpacity key={label} style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
              <View style={styles.menuIconWrapper}>
                <Ionicons name={icon} size={20} color={COLORS.primary} />
              </View>
              <Text style={styles.menuLabel}>{label}</Text>
              <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.danger} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 56, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md,
  },
  backBtn: { width: 40, padding: SPACING.xs },
  headerTitle: { fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.text },
  scroll: { padding: SPACING.lg, gap: SPACING.lg, paddingBottom: 40 },
  profileSection: { alignItems: 'center', gap: SPACING.xs },
  avatar: {
    width: 90, height: 90, borderRadius: 45, alignItems: 'center', justifyContent: 'center',
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4, shadowRadius: 16, elevation: 10,
  },
  avatarText: { color: '#fff', fontSize: 36, fontWeight: '800' },
  name: { fontSize: FONTS.sizes.xxl, fontWeight: '800', color: COLORS.text },
  email: { fontSize: FONTS.sizes.md, color: COLORS.textSecondary },
  joinDate: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted },
  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm,
  },
  statCard: {
    flex: 1, minWidth: '45%', backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border,
    padding: SPACING.md, alignItems: 'center', gap: 4,
  },
  statValue: { fontSize: FONTS.sizes.xxl, fontWeight: '800' },
  statLabel: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, fontWeight: '500' },
  menuSection: {
    backgroundColor: COLORS.card, borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    padding: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  menuIconWrapper: {
    width: 36, height: 36, borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.primary + '22', alignItems: 'center', justifyContent: 'center',
  },
  menuLabel: { flex: 1, fontSize: FONTS.sizes.md, color: COLORS.text, fontWeight: '500' },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm,
    backgroundColor: COLORS.danger + '15', borderRadius: BORDER_RADIUS.md,
    borderWidth: 1, borderColor: COLORS.danger + '44', padding: SPACING.md,
  },
  logoutText: { color: COLORS.danger, fontSize: FONTS.sizes.md, fontWeight: '700' },
});
