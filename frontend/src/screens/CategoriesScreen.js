import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, Alert, Modal,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { fetchCategories, createCategory, deleteCategory } from '../store/slices/categoriesSlice';
import { COLORS, SPACING, FONTS, BORDER_RADIUS, CATEGORY_COLORS, CATEGORY_ICONS } from '../utils/theme';

export default function CategoriesScreen({ navigation }) {
  const dispatch = useDispatch();
  const { items: categories } = useSelector((state) => state.categories);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', color: CATEGORY_COLORS[0], icon: 'folder' });

  useEffect(() => { dispatch(fetchCategories()); }, []);

  const handleCreate = async () => {
    if (!form.name.trim()) return Alert.alert('Error', 'Name is required');
    try {
      await dispatch(createCategory(form)).unwrap();
      setShowModal(false);
      setForm({ name: '', color: CATEGORY_COLORS[0], icon: 'folder' });
    } catch (err) {
      Alert.alert('Error', err);
    }
  };

  const handleDelete = (id, name) => {
    Alert.alert('Delete Category', `Delete "${name}"? Todos in this category won't be deleted.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => dispatch(deleteCategory(id)) },
    ]);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#16213e', '#0f0f1a']} style={styles.header}>
        <Text style={styles.headerTitle}>Categories</Text>
        <TouchableOpacity onPress={() => setShowModal(true)} style={styles.addBtn}>
          <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.addBtnGradient}>
            <Ionicons name="add" size={22} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.categoryCard}>
            <View style={[styles.catIcon, { backgroundColor: item.color + '22' }]}>
              <Ionicons name={item.icon} size={24} color={item.color} />
            </View>
            <View style={styles.catInfo}>
              <Text style={styles.catName}>{item.name}</Text>
              <Text style={styles.catCount}>{item.todo_count || 0} todos • {item.pending_count || 0} pending</Text>
            </View>
            <TouchableOpacity onPress={() => handleDelete(item.id, item.name)} style={styles.deleteBtn}>
              <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="folder-open-outline" size={64} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>No categories yet</Text>
          </View>
        }
      />

      {/* Create Modal */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Category</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.modalInput}
              placeholder="Category name"
              placeholderTextColor={COLORS.textMuted}
              value={form.name}
              onChangeText={(v) => setForm({ ...form, name: v })}
            />

            <Text style={styles.modalLabel}>Color</Text>
            <View style={styles.colorRow}>
              {CATEGORY_COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[styles.colorDot, { backgroundColor: color }, form.color === color && styles.colorDotSelected]}
                  onPress={() => setForm({ ...form, color })}
                />
              ))}
            </View>

            <Text style={styles.modalLabel}>Icon</Text>
            <View style={styles.iconGrid}>
              {CATEGORY_ICONS.map((icon) => (
                <TouchableOpacity
                  key={icon}
                  style={[styles.iconBtn, form.icon === icon && { backgroundColor: form.color + '33', borderColor: form.color }]}
                  onPress={() => setForm({ ...form, icon })}
                >
                  <Ionicons name={icon} size={20} color={form.icon === icon ? form.color : COLORS.textSecondary} />
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.createBtn} onPress={handleCreate} activeOpacity={0.8}>
              <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.createBtnGradient}>
                <Text style={styles.createBtnText}>Create Category</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 56, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md,
  },
  headerTitle: { fontSize: FONTS.sizes.xxl, fontWeight: '800', color: COLORS.text },
  addBtn: { borderRadius: BORDER_RADIUS.full, overflow: 'hidden' },
  addBtnGradient: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  list: { padding: SPACING.md, gap: SPACING.sm },
  categoryCard: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    backgroundColor: COLORS.card, borderRadius: BORDER_RADIUS.md,
    borderWidth: 1, borderColor: COLORS.border, padding: SPACING.md,
  },
  catIcon: { width: 48, height: 48, borderRadius: BORDER_RADIUS.sm, alignItems: 'center', justifyContent: 'center' },
  catInfo: { flex: 1 },
  catName: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.text },
  catCount: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginTop: 2 },
  deleteBtn: { padding: SPACING.xs },
  empty: { alignItems: 'center', paddingTop: 80, gap: SPACING.sm },
  emptyText: { fontSize: FONTS.sizes.lg, color: COLORS.textSecondary },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modal: {
    backgroundColor: COLORS.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: SPACING.lg, gap: SPACING.md,
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle: { fontSize: FONTS.sizes.xl, fontWeight: '800', color: COLORS.text },
  modalLabel: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.textSecondary },
  modalInput: {
    backgroundColor: COLORS.card, borderRadius: BORDER_RADIUS.md,
    borderWidth: 1, borderColor: COLORS.border,
    paddingHorizontal: SPACING.md, height: 50, color: COLORS.text, fontSize: FONTS.sizes.md,
  },
  colorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  colorDot: { width: 32, height: 32, borderRadius: 16 },
  colorDotSelected: { borderWidth: 3, borderColor: '#fff' },
  iconGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  iconBtn: {
    width: 44, height: 44, borderRadius: BORDER_RADIUS.sm, alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border,
  },
  createBtn: { borderRadius: BORDER_RADIUS.md, overflow: 'hidden', marginTop: SPACING.sm, marginBottom: SPACING.lg },
  createBtnGradient: { height: 52, alignItems: 'center', justifyContent: 'center' },
  createBtnText: { color: '#fff', fontSize: FONTS.sizes.lg, fontWeight: '700' },
});
