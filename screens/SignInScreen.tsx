import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../constants/theme';

interface SignInScreenProps {
  navigation: any;
}

export default function SignInScreen({ navigation }: SignInScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  
  const { signIn } = useSupabaseAuth();
  const { colors } = useTheme();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: '', password: '' };

    if (!email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
      valid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await signIn(email, password);
    } catch (error: any) {
      Alert.alert('Sign In Failed', error.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <LinearGradient
        colors={[colors.primary, colors.primaryLight, colors.accent]}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Animated.View entering={FadeInUp.duration(800)} style={styles.header}>
          <MaterialIcons name="business-center" size={60} color="#FFFFFF" />
          <Text style={styles.headerTitle}>Welcome Back</Text>
          <Text style={styles.headerSubtitle}>Sign in to continue your journey</Text>
        </Animated.View>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.formContainer}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Email</Text>
              <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: errors.email ? colors.error : colors.border }]}>
                <MaterialIcons name="email" size={20} color={colors.textLight} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="your.email@school.edu"
                  placeholderTextColor={colors.textLight}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setErrors({ ...errors, email: '' });
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Password</Text>
              <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: errors.password ? colors.error : colors.border }]}>
                <MaterialIcons name="lock" size={20} color={colors.textLight} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.textLight}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setErrors({ ...errors, password: '' });
                  }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <MaterialIcons 
                    name={showPassword ? 'visibility' : 'visibility-off'} 
                    size={20} 
                    color={colors.textLight} 
                  />
                </TouchableOpacity>
              </View>
              {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
            </View>

            <TouchableOpacity
              style={[styles.signInButton, { backgroundColor: colors.primary }]}
              onPress={handleSignIn}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <Text style={styles.signInButtonText}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Text>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={[styles.dividerLine, { backgroundColor: colors.divider }]} />
              <Text style={[styles.dividerText, { color: colors.textLight }]}>OR</Text>
              <View style={[styles.dividerLine, { backgroundColor: colors.divider }]} />
            </View>

            <TouchableOpacity
              style={[styles.signUpButton, { borderColor: colors.primary }]}
              onPress={() => navigation.navigate('SignUp')}
              activeOpacity={0.8}
            >
              <Text style={[styles.signUpButtonText, { color: colors.primary }]}>
                Create New Account
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.lg,
    borderBottomLeftRadius: BORDER_RADIUS.xxl,
    borderBottomRightRadius: BORDER_RADIUS.xxl,
  },
  header: {
    alignItems: 'center',
  },
  headerTitle: {
    ...TYPOGRAPHY.h1,
    color: '#FFFFFF',
    marginTop: SPACING.md,
  },
  headerSubtitle: {
    ...TYPOGRAPHY.body,
    color: '#E8F0FE',
    marginTop: SPACING.xs,
  },
  keyboardView: {
    flex: 1,
  },
  formContainer: {
    padding: SPACING.lg,
  },
  form: {
    marginTop: SPACING.lg,
  },
  inputContainer: {
    marginBottom: SPACING.lg,
  },
  label: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 56,
  },
  input: {
    flex: 1,
    ...TYPOGRAPHY.body,
    marginLeft: SPACING.sm,
  },
  errorText: {
    ...TYPOGRAPHY.caption,
    color: '#EF4444',
    marginTop: SPACING.xs,
  },
  signInButton: {
    height: 56,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  signInButtonText: {
    ...TYPOGRAPHY.body,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    ...TYPOGRAPHY.caption,
    marginHorizontal: SPACING.md,
  },
  signUpButton: {
    height: 56,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  signUpButtonText: {
    ...TYPOGRAPHY.body,
    fontWeight: '700',
  },
});
