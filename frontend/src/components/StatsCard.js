import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../utils/theme';

export default function StatsCard({ stats }) {
  const completion = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const items = [
    { label: 'Total', value: stats.total, icon: 'list', color: COLORS.primary },
    { label: 'Pending', value: stats.pending, icon: 'time-outline', color: COLORS.warning },
    { label: 'Overdue', value: stats.overdue, icon: 'alert-circle-outline', color: COLORS.danger },
    { label: 'Today', value: stats.due_today, icon: 'today-outline', color: COLORS.info },
  ];

  return (
    <View style={styles.container}>
      {/* Progress */}
      <LinearGradient colors={[COLORS.primary + 'dd', COLORS.primaryDark + 'dd']} style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <View>
            <Text style={styles.progressTitle}>Today's Progress</Text>
            <Text style={styles.progressSubtitle}>{stats.completed} of {stats.total} completed</Text>
          </View>
          <Text style={styles.progressPercent}>{completion}%</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${completion}%` }]} />
        </View>
      </LinearGradient>

      {/* Stats row */}
      <View style={styles.statsRow}>
        {items.map(({ label, value, icon, color }) => (
          <View key={label} style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: color + '22' }]}>
              <Ionicons name={icon} size={16} color={color} />
            </View>
            <Text style={[styles.statValue, { color }]}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.md, gap: SPACING.sm },
  progressCard: {
    borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, gap: SPACING.sm,
  },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressTitle: { fontSize: FONTS.sizes.md, fontWeight: '700', color: '#fff' },
  progressSubtitle: { fontSize: FONTS.sizes.sm, color: 'rgba(255,255,255,0.75)' },
  progressPercent: { fontSize: FONTS.sizes.xxl, fontWeight: '800', color: '#fff' },
  progressBar: { height: 6, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 3 },
  progressFill: { height: '100%', backgroundColor: '#fff', borderRadius: 3 },
  statsRow: {
    flexDirection: 'row', backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border,
    padding: SPACING.sm,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 4 },
  statIcon: { width: 36, height: 36, borderRadius: BORDER_RADIUS.sm, alignItems: 'center', justifyContent: 'center' },
  statValue: { fontSize: FONTS.sizes.xl, fontWeight: '800' },
  statLabel: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, fontWeight: '500' },
});
