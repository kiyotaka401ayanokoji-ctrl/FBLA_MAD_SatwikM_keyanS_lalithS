import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../constants/theme';

interface SignUpScreenProps {
  navigation: any;
}

export default function SignUpScreen({ navigation }: SignUpScreenProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    chapter: '',
    position: '',
    phone: '',
    bio: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  
  const { signUp } = useSupabaseAuth();
  const { colors } = useTheme();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
    return phoneRegex.test(phone);
  };

  const formatPhone = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  };

  const validateForm = () => {
    let valid = true;
    const newErrors: any = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }

    if (!formData.chapter.trim()) {
      newErrors.chapter = 'Chapter is required';
      valid = false;
    }

    if (!formData.position.trim()) {
      newErrors.position = 'Position is required';
      valid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
      valid = false;
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await signUp(formData);
    } catch (error: any) {
      Alert.alert('Sign Up Failed', error.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: '' });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <LinearGradient
        colors={[colors.primary, colors.primaryLight, colors.accent]}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Account</Text>
          <Text style={styles.headerSubtitle}>Join FBLA Connect today</Text>
        </View>
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
            <InputField
              label="Full Name"
              icon="person"
              placeholder="John Doe"
              value={formData.name}
              onChangeText={(text) => updateField('name', text)}
              error={errors.name}
              colors={colors}
            />

            <InputField
              label="Email"
              icon="email"
              placeholder="your.email@school.edu"
              value={formData.email}
              onChangeText={(text) => updateField('email', text)}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              colors={colors}
            />

            <InputField
              label="Password"
              icon="lock"
              placeholder="At least 6 characters"
              value={formData.password}
              onChangeText={(text) => updateField('password', text)}
              error={errors.password}
              secureTextEntry={!showPassword}
              rightIcon={showPassword ? 'visibility' : 'visibility-off'}
              onRightIconPress={() => setShowPassword(!showPassword)}
              colors={colors}
            />

            <InputField
              label="Confirm Password"
              icon="lock"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChangeText={(text) => updateField('confirmPassword', text)}
              error={errors.confirmPassword}
              secureTextEntry={!showPassword}
              colors={colors}
            />

            <InputField
              label="Chapter"
              icon="school"
              placeholder="Lincoln High School"
              value={formData.chapter}
              onChangeText={(text) => updateField('chapter', text)}
              error={errors.chapter}
              colors={colors}
            />

            <InputField
              label="Position"
              icon="badge"
              placeholder="Member, Officer, etc."
              value={formData.position}
              onChangeText={(text) => updateField('position', text)}
              error={errors.position}
              colors={colors}
            />

            <InputField
              label="Phone"
              icon="phone"
              placeholder="(555) 123-4567"
              value={formData.phone}
              onChangeText={(text) => updateField('phone', formatPhone(text))}
              error={errors.phone}
              keyboardType="phone-pad"
              colors={colors}
            />

            <InputField
              label="Bio (Optional)"
              icon="info"
              placeholder="Tell us about yourself..."
              value={formData.bio}
              onChangeText={(text) => updateField('bio', text)}
              multiline
              colors={colors}
            />

            <TouchableOpacity
              style={[styles.signUpButton, { backgroundColor: colors.primary }]}
              onPress={handleSignUp}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <Text style={styles.signUpButtonText}>
                {isLoading ? 'Creating Account...' : 'Sign Up'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.signInLink}
              onPress={() => navigation.goBack()}
            >
              <Text style={[styles.signInLinkText, { color: colors.textSecondary }]}>
                Already have an account?{' '}
                <Text style={{ color: colors.primary, fontWeight: '700' }}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function InputField({ 
  label, 
  icon, 
  placeholder, 
  value, 
  onChangeText, 
  error, 
  secureTextEntry, 
  rightIcon, 
  onRightIconPress,
  keyboardType,
  autoCapitalize,
  multiline,
  colors,
}: any) {
  return (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <View style={[
        styles.inputWrapper, 
        { backgroundColor: colors.surface, borderColor: error ? colors.error : colors.border },
        multiline && styles.inputWrapperMultiline
      ]}>
        <MaterialIcons name={icon} size={20} color={colors.textLight} />
        <TextInput
          style={[
            styles.input, 
            { color: colors.text },
            multiline && styles.inputMultiline
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors.textLight}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
        />
        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress}>
            <MaterialIcons name={rightIcon} size={20} color={colors.textLight} />
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    borderBottomLeftRadius: BORDER_RADIUS.xxl,
    borderBottomRightRadius: BORDER_RADIUS.xxl,
  },
  header: {
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: SPACING.xs,
  },
  headerTitle: {
    ...TYPOGRAPHY.h1,
    color: '#FFFFFF',
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
    paddingBottom: SPACING.xxl,
  },
  form: {
    marginTop: SPACING.md,
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
    minHeight: 56,
  },
  inputWrapperMultiline: {
    alignItems: 'flex-start',
    paddingVertical: SPACING.md,
  },
  input: {
    flex: 1,
    ...TYPOGRAPHY.body,
    marginLeft: SPACING.sm,
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    ...TYPOGRAPHY.caption,
    color: '#EF4444',
    marginTop: SPACING.xs,
  },
  signUpButton: {
    height: 56,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  signUpButtonText: {
    ...TYPOGRAPHY.body,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  signInLink: {
    marginTop: SPACING.lg,
    alignItems: 'center',
  },
  signInLinkText: {
    ...TYPOGRAPHY.body,
  },
});
