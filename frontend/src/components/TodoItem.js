import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format, isAfter, parseISO } from 'date-fns';
import { COLORS, SPACING, FONTS, BORDER_RADIUS, PRIORITY_CONFIG } from '../utils/theme';

export default function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleToggle = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();
    onToggle();
  };

  const confirmDelete = () => {
    Alert.alert('Delete Todo', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: onDelete },
    ]);
  };

  const priority = PRIORITY_CONFIG[todo.priority] || PRIORITY_CONFIG.medium;
  const isOverdue = todo.due_date && !todo.is_completed && isAfter(new Date(), parseISO(todo.due_date));

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        style={[styles.card, todo.is_completed && styles.completedCard]}
        onPress={onEdit}
        activeOpacity={0.8}
      >
        {/* Priority indicator */}
        <View style={[styles.priorityBar, { backgroundColor: priority.color }]} />

        <View style={styles.content}>
          {/* Checkbox + Title */}
          <View style={styles.topRow}>
            <TouchableOpacity
              style={[styles.checkbox, todo.is_completed && { backgroundColor: priority.color, borderColor: priority.color }]}
              onPress={handleToggle}
            >
              {todo.is_completed && <Ionicons name="checkmark" size={14} color="#fff" />}
            </TouchableOpacity>

            <View style={styles.titleArea}>
              <Text style={[styles.title, todo.is_completed && styles.completedTitle]} numberOfLines={2}>
                {todo.title}
              </Text>
              {todo.description ? (
                <Text style={styles.description} numberOfLines={1}>{todo.description}</Text>
              ) : null}
            </View>

            <TouchableOpacity onPress={confirmDelete} style={styles.deleteBtn}>
              <Ionicons name="trash-outline" size={16} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Meta */}
          <View style={styles.metaRow}>
            {/* Priority badge */}
            <View style={[styles.badge, { backgroundColor: priority.color + '22' }]}>
              <Ionicons name={priority.icon} size={10} color={priority.color} />
              <Text style={[styles.badgeText, { color: priority.color }]}>{priority.label}</Text>
            </View>

            {/* Category */}
            {todo.category_name && (
              <View style={[styles.badge, { backgroundColor: (todo.category_color || COLORS.primary) + '22' }]}>
                <View style={[styles.catDot, { backgroundColor: todo.category_color || COLORS.primary }]} />
                <Text style={[styles.badgeText, { color: todo.category_color || COLORS.primary }]}>
                  {todo.category_name}
                </Text>
              </View>
            )}

            {/* Due date */}
            {todo.due_date && (
              <View style={[styles.badge, { backgroundColor: isOverdue ? COLORS.danger + '22' : COLORS.textMuted + '22' }]}>
                <Ionicons name="calendar-outline" size={10} color={isOverdue ? COLORS.danger : COLORS.textSecondary} />
                <Text style={[styles.badgeText, { color: isOverdue ? COLORS.danger : COLORS.textSecondary }]}>
                  {format(parseISO(todo.due_date), 'MMM d')}
                </Text>
              </View>
            )}

            {/* Tags */}
            {todo.tags?.slice(0, 2).map(tag => (
              <View key={tag} style={[styles.badge, { backgroundColor: COLORS.primary + '11' }]}>
                <Text style={[styles.badgeText, { color: COLORS.primary }]}>#{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.sm },
  card: {
    flexDirection: 'row', backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border,
    overflow: 'hidden',
  },
  completedCard: { opacity: 0.6 },
  priorityBar: { width: 4 },
  content: { flex: 1, padding: SPACING.md, gap: SPACING.sm },
  topRow: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.sm },
  checkbox: {
    width: 22, height: 22, borderRadius: 6, borderWidth: 2,
    borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center',
    marginTop: 1, flexShrink: 0,
  },
  titleArea: { flex: 1 },
  title: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.text, lineHeight: 22 },
  completedTitle: { textDecorationLine: 'line-through', color: COLORS.textMuted },
  description: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginTop: 2 },
  deleteBtn: { padding: 4 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: BORDER_RADIUS.full,
  },
  badgeText: { fontSize: FONTS.sizes.xs, fontWeight: '600' },
  catDot: { width: 6, height: 6, borderRadius: 3 },
});
