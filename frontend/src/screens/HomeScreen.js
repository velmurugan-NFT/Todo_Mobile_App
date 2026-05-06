import React, { useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  RefreshControl, ActivityIndicator, TextInput,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { fetchTodos, fetchStats, toggleTodo, deleteTodo, setFilter } from '../store/slices/todosSlice';
import { fetchCategories } from '../store/slices/categoriesSlice';
import TodoItem from '../components/TodoItem';
import StatsCard from '../components/StatsCard';
import FilterChips from '../components/FilterChips';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../utils/theme';

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const { items: todos, loading, stats, filter } = useSelector((state) => state.todos);
  const { user } = useSelector((state) => state.auth);

  const loadData = useCallback(() => {
    const params = {};
    if (filter.status !== 'all') params.status = filter.status;
    if (filter.priority) params.priority = filter.priority;
    if (filter.category_id) params.category_id = filter.category_id;
    if (filter.search) params.search = filter.search;
    dispatch(fetchTodos(params));
    dispatch(fetchStats());
  }, [filter, dispatch]);

  useEffect(() => {
    loadData();
    dispatch(fetchCategories());
  }, [loadData]);

  const handleToggle = (id) => dispatch(toggleTodo(id));
  const handleDelete = (id) => dispatch(deleteTodo(id));
  const handleEdit = (todo) => navigation.navigate('TodoDetail', { todo });
  const handleSearch = (text) => dispatch(setFilter({ search: text }));

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#16213e', '#0f0f1a']} style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>{greeting()},</Text>
            <Text style={styles.userName}>{user?.name?.split(' ')[0]} 👋</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.avatarBtn}>
            <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.avatar}>
              <Text style={styles.avatarText}>{user?.name?.charAt(0)?.toUpperCase()}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchWrapper}>
          <Ionicons name="search-outline" size={20} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search todos..."
            placeholderTextColor={COLORS.textMuted}
            value={filter.search}
            onChangeText={handleSearch}
          />
          {filter.search ? (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Ionicons name="close-circle" size={18} color={COLORS.textSecondary} />
            </TouchableOpacity>
          ) : null}
        </View>
      </LinearGradient>

      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} tintColor={COLORS.primary} />}
        ListHeaderComponent={
          <>
            {stats && <StatsCard stats={stats} />}
            <FilterChips />
          </>
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles.empty}>
              <Ionicons name="checkbox-outline" size={64} color={COLORS.textMuted} />
              <Text style={styles.emptyTitle}>No todos found</Text>
              <Text style={styles.emptySubtitle}>Tap + to add your first todo</Text>
            </View>
          )
        }
        renderItem={({ item }) => (
          <TodoItem
            todo={item}
            onToggle={() => handleToggle(item.id)}
            onDelete={() => handleDelete(item.id)}
            onEdit={() => handleEdit(item)}
          />
        )}
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateTodo')}
        activeOpacity={0.85}
      >
        <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.fabGradient}>
          <Ionicons name="add" size={32} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingTop: 56, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  greeting: { fontSize: FONTS.sizes.md, color: COLORS.textSecondary },
  userName: { fontSize: FONTS.sizes.xxl, fontWeight: '800', color: COLORS.text },
  avatarBtn: { borderRadius: BORDER_RADIUS.full, overflow: 'hidden' },
  avatar: { width: 44, height: 44, borderRadius: BORDER_RADIUS.full, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: FONTS.sizes.lg, fontWeight: '700' },
  searchWrapper: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    backgroundColor: COLORS.card, borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.border,
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
  },
  searchInput: { flex: 1, color: COLORS.text, fontSize: FONTS.sizes.md },
  list: { padding: SPACING.md, paddingBottom: 100 },
  empty: { alignItems: 'center', paddingTop: SPACING.xxl, gap: SPACING.sm },
  emptyTitle: { fontSize: FONTS.sizes.xl, fontWeight: '700', color: COLORS.textSecondary },
  emptySubtitle: { fontSize: FONTS.sizes.md, color: COLORS.textMuted },
  fab: {
    position: 'absolute', bottom: 90, right: SPACING.lg,
    borderRadius: BORDER_RADIUS.full, overflow: 'hidden',
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5, shadowRadius: 16, elevation: 10,
  },
  fabGradient: { width: 64, height: 64, alignItems: 'center', justifyContent: 'center' },
});
