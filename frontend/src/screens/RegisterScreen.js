import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { register, clearError } from '../store/slices/authSlice';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../utils/theme';

export default function RegisterScreen({ navigation }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (error) { Alert.alert('Registration Failed', error); dispatch(clearError()); }
  }, [error]);

  const handleRegister = () => {
    const { name, email, password, confirmPassword } = form;
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      return Alert.alert('Error', 'Please fill in all fields');
    }
    if (password !== confirmPassword) {
      return Alert.alert('Error', 'Passwords do not match');
    }
    if (password.length < 6) {
      return Alert.alert('Error', 'Password must be at least 6 characters');
    }
    dispatch(register({ name: name.trim(), email: email.trim().toLowerCase(), password }));
  };

  const update = (key, val) => setForm({ ...form, [key]: val });

  const fields = [
    { key: 'name', label: 'Full Name', icon: 'person-outline', placeholder: 'John Doe', keyboardType: 'default' },
    { key: 'email', label: 'Email', icon: 'mail-outline', placeholder: 'your@email.com', keyboardType: 'email-address' },
    { key: 'password', label: 'Password', icon: 'lock-closed-outline', placeholder: '••••••••', secure: true },
    { key: 'confirmPassword', label: 'Confirm Password', icon: 'shield-checkmark-outline', placeholder: '••••••••', secure: true },
  ];

  return (
    <LinearGradient colors={['#0f0f1a', '#16213e', '#0f0f1a']} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.logo}>
                <Ionicons name="person-add" size={36} color="#fff" />
              </LinearGradient>
            </View>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join us and stay organized</Text>
          </View>

          <View style={styles.form}>
            {fields.map(({ key, label, icon, placeholder, keyboardType, secure }) => (
              <View key={key} style={styles.inputGroup}>
                <Text style={styles.label}>{label}</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name={icon} size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor={COLORS.textMuted}
                    value={form[key]}
                    onChangeText={(val) => update(key, val)}
                    keyboardType={keyboardType || 'default'}
                    autoCapitalize={key === 'name' ? 'words' : 'none'}
                    secureTextEntry={secure && !showPassword}
                    autoCorrect={false}
                  />
                  {secure && (
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.textSecondary} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}

            <TouchableOpacity style={styles.btn} onPress={handleRegister} disabled={loading} activeOpacity={0.8}>
              <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.btnGradient}>
                {loading ? <ActivityIndicator color="#fff" /> : (
                  <>
                    <Text style={styles.btnText}>Create Account</Text>
                    <Ionicons name="arrow-forward" size={20} color="#fff" />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.footerLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, padding: SPACING.lg, paddingTop: SPACING.xxl },
  backBtn: { marginBottom: SPACING.lg },
  header: { alignItems: 'center', marginBottom: SPACING.xl },
  logoContainer: { marginBottom: SPACING.md },
  logo: {
    width: 80, height: 80, borderRadius: BORDER_RADIUS.xl,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5, shadowRadius: 16, elevation: 10,
  },
  title: { fontSize: FONTS.sizes.xxxl, fontWeight: '800', color: COLORS.text, marginBottom: SPACING.xs },
  subtitle: { fontSize: FONTS.sizes.md, color: COLORS.textSecondary },
  form: { gap: SPACING.md },
  inputGroup: { gap: SPACING.xs },
  label: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.textSecondary, marginLeft: SPACING.xs },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.card, borderRadius: BORDER_RADIUS.md,
    borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: SPACING.md,
  },
  inputIcon: { marginRight: SPACING.sm },
  input: { flex: 1, height: 52, color: COLORS.text, fontSize: FONTS.sizes.md },
  btn: { marginTop: SPACING.sm, borderRadius: BORDER_RADIUS.md, overflow: 'hidden' },
  btnGradient: { height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm },
  btnText: { color: '#fff', fontSize: FONTS.sizes.lg, fontWeight: '700' },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: SPACING.md, marginBottom: SPACING.xl },
  footerText: { color: COLORS.textSecondary, fontSize: FONTS.sizes.md },
  footerLink: { color: COLORS.primary, fontSize: FONTS.sizes.md, fontWeight: '700' },
});
