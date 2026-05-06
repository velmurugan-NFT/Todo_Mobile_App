import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform, Alert, Switch,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { createTodo, updateTodo } from '../store/slices/todosSlice';
import { COLORS, SPACING, FONTS, BORDER_RADIUS, PRIORITY_CONFIG } from '../utils/theme';

export default function CreateTodoScreen({ navigation, route }) {
  const dispatch = useDispatch();
  const { items: categories = [] } = useSelector((state) => state.categories);
  const editTodo = route.params?.todo;
  const isEditing = !!editTodo;

  const [form, setForm] = useState({
    title: editTodo?.title || '',
    description: editTodo?.description || '',
    priority: editTodo?.priority || 'medium',
    category_id: editTodo?.category_id || null,
    due_date: editTodo?.due_date || null,
    tags: editTodo?.tags || [],
  });
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (key, val) => setForm({ ...form, [key]: val });

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !form.tags.includes(tag)) {
      update('tags', [...form.tags, tag]);
      setTagInput('');
    }
  };

  const removeTag = (tag) => update('tags', form.tags.filter(t => t !== tag));

  const handleSave = async () => {
    if (!form.title.trim()) return Alert.alert('Error', 'Title is required');
    setLoading(true);
    try {
      if (isEditing) {
        await dispatch(updateTodo({ id: editTodo.id, data: form })).unwrap();
      } else {
        await dispatch(createTodo(form)).unwrap();
      }
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err?.message || 'Failed to save todo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#16213e', '#0f0f1a']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEditing ? 'Edit Todo' : 'New Todo'}</Text>
        <TouchableOpacity onPress={handleSave} disabled={loading} style={styles.saveBtn}>
          <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.saveBtnGradient}>
            <Text style={styles.saveBtnText}>{loading ? '...' : 'Save'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Title */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Title *</Text>
            <TextInput
              style={styles.titleInput}
              placeholder="What needs to be done?"
              placeholderTextColor={COLORS.textMuted}
              value={form.title}
              onChangeText={(v) => update('title', v)}
              multiline
            />
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Description</Text>
            <TextInput
              style={styles.descInput}
              placeholder="Add details..."
              placeholderTextColor={COLORS.textMuted}
              value={form.description}
              onChangeText={(v) => update('description', v)}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Priority */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Priority</Text>
            <View style={styles.priorityRow}>
              {Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => (
                <TouchableOpacity
                  key={key}
                  style={[styles.priorityBtn, form.priority === key && { borderColor: cfg.color, backgroundColor: cfg.color + '22' }]}
                  onPress={() => update('priority', key)}
                >
                  <Ionicons name={cfg.icon} size={16} color={form.priority === key ? cfg.color : COLORS.textSecondary} />
                  <Text style={[styles.priorityText, form.priority === key && { color: cfg.color }]}>{cfg.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Category */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.categoryRow}>
                <TouchableOpacity
                  style={[styles.categoryBtn, !form.category_id && styles.categoryBtnActive]}
                  onPress={() => update('category_id', null)}
                >
                  <Text style={[styles.categoryBtnText, !form.category_id && styles.categoryBtnTextActive]}>None</Text>
                </TouchableOpacity>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.categoryBtn, form.category_id === cat.id && { borderColor: cat.color, backgroundColor: cat.color + '22' }]}
                    onPress={() => update('category_id', cat.id)}
                  >
                    <View style={[styles.catDot, { backgroundColor: cat.color }]} />
                    <Text style={[styles.categoryBtnText, form.category_id === cat.id && { color: cat.color }]}>{cat.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Tags */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Tags</Text>
            <View style={styles.tagInputRow}>
              <TextInput
                style={styles.tagInput}
                placeholder="Add a tag..."
                placeholderTextColor={COLORS.textMuted}
                value={tagInput}
                onChangeText={setTagInput}
                onSubmitEditing={addTag}
                returnKeyType="done"
              />
              <TouchableOpacity style={styles.addTagBtn} onPress={addTag}>
                <Ionicons name="add" size={20} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
            {form.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {form.tags.map((tag) => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>#{tag}</Text>
                    <TouchableOpacity onPress={() => removeTag(tag)}>
                      <Ionicons name="close" size={14} color={COLORS.primary} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 56, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md,
  },
  backBtn: { padding: SPACING.xs },
  headerTitle: { fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.text },
  saveBtn: { borderRadius: BORDER_RADIUS.sm, overflow: 'hidden' },
  saveBtnGradient: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm },
  saveBtnText: { color: '#fff', fontWeight: '700' },
  scroll: { padding: SPACING.lg, gap: SPACING.lg },
  section: { gap: SPACING.sm },
  sectionLabel: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.textSecondary },
  titleInput: {
    backgroundColor: COLORS.card, borderRadius: BORDER_RADIUS.md,
    borderWidth: 1, borderColor: COLORS.border,
    padding: SPACING.md, color: COLORS.text, fontSize: FONTS.sizes.lg,
    fontWeight: '600', minHeight: 60,
  },
  descInput: {
    backgroundColor: COLORS.card, borderRadius: BORDER_RADIUS.md,
    borderWidth: 1, borderColor: COLORS.border,
    padding: SPACING.md, color: COLORS.text, fontSize: FONTS.sizes.md,
    minHeight: 80, textAlignVertical: 'top',
  },
  priorityRow: { flexDirection: 'row', gap: SPACING.sm },
  priorityBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: SPACING.xs, padding: SPACING.sm, borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.card,
  },
  priorityText: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.textSecondary },
  categoryRow: { flexDirection: 'row', gap: SPACING.sm },
  categoryBtn: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.xs,
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.card,
  },
  categoryBtnActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '22' },
  categoryBtnText: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.textSecondary },
  categoryBtnTextActive: { color: COLORS.primary },
  catDot: { width: 8, height: 8, borderRadius: 4 },
  tagInputRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  tagInput: {
    flex: 1, backgroundColor: COLORS.card, borderRadius: BORDER_RADIUS.md,
    borderWidth: 1, borderColor: COLORS.border,
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    color: COLORS.text, fontSize: FONTS.sizes.md,
  },
  addTagBtn: {
    width: 44, height: 44, backgroundColor: COLORS.card, borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center',
  },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs },
  tag: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: COLORS.primary + '22', paddingHorizontal: SPACING.sm,
    paddingVertical: 4, borderRadius: BORDER_RADIUS.full,
    borderWidth: 1, borderColor: COLORS.primary + '44',
  },
  tagText: { fontSize: FONTS.sizes.xs, color: COLORS.primary, fontWeight: '600' },
});