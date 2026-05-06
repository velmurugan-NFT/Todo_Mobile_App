import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter } from '../store/slices/todosSlice';
import { COLORS, SPACING, FONTS, BORDER_RADIUS, PRIORITY_CONFIG } from '../utils/theme';

export default function FilterChips() {
  const dispatch = useDispatch();
  const { filter } = useSelector((state) => state.todos);

  const statusFilters = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'completed', label: 'Done' },
  ];

  const priorityFilters = [
    { key: null, label: 'Any' },
    { key: 'high', label: '🔴 High' },
    { key: 'medium', label: '🟡 Medium' },
    { key: 'low', label: '🟢 Low' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.row}>
          {statusFilters.map(({ key, label }) => (
            <TouchableOpacity
              key={key}
              style={[styles.chip, filter.status === key && styles.chipActive]}
              onPress={() => dispatch(setFilter({ status: key }))}
            >
              <Text style={[styles.chipText, filter.status === key && styles.chipTextActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}

          <View style={styles.divider} />

          {priorityFilters.map(({ key, label }) => (
            <TouchableOpacity
              key={String(key)}
              style={[styles.chip, filter.priority === key && styles.chipActive]}
              onPress={() => dispatch(setFilter({ priority: key }))}
            >
              <Text style={[styles.chipText, filter.priority === key && styles.chipTextActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  chip: {
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full, borderWidth: 1, borderColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  chipActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '22' },
  chipText: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.textSecondary },
  chipTextActive: { color: COLORS.primary },
  divider: { width: 1, height: 20, backgroundColor: COLORS.border, marginHorizontal: SPACING.xs },
});
