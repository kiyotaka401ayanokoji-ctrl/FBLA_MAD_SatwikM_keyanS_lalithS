import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import { BlurView } from 'expo-blur';

import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { SupabaseAuthProvider, useSupabaseAuth } from './contexts/SupabaseAuthContext';
import { initMembersDatabase } from './utils/membersDatabase';

import SplashScreen from './screens/SplashScreen';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import DashboardScreen from './screens/DashboardScreen';
import CalendarScreen from './screens/CalendarScreen';
import AnnouncementsScreen from './screens/AnnouncementsScreen';
import ResourcesScreen from './screens/ResourcesScreen';
import ProfileScreen from './screens/ProfileScreen';
import EventDetailScreen from './screens/EventDetailScreen';
import AICoachScreen from './screens/AICoachScreen';
import MembersHubScreen from './screens/MembersHubScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  const { colors, isDarkMode } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: isDarkMode ? 'rgba(26, 31, 46, 0.85)' : 'rgba(255, 255, 255, 0.95)',
          borderTopWidth: 1.5,
          borderTopColor: isDarkMode ? colors.glassBorder : colors.border,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          paddingTop: 8,
          height: Platform.OS === 'ios' ? 88 : 68,
          elevation: 0,
          shadowColor: isDarkMode ? colors.primary : '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: isDarkMode ? 0.15 : 0.08,
          shadowRadius: 12,
        },
        tabBarBackground: () => (
          <BlurView
            intensity={isDarkMode ? 85 : 95}
            tint={isDarkMode ? 'dark' : 'light'}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              backgroundColor: isDarkMode ? 'rgba(26, 31, 46, 0.3)' : 'rgba(255, 255, 255, 0.5)',
            }}
          />
        ),
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="dashboard" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="event" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Announcements"
        component={AnnouncementsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="campaign" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Resources"
        component={ResourcesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="folder" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
}

function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen 
        name="EventDetail" 
        component={EventDetailScreen}
        options={{
          presentation: 'card',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="AICoach" 
        component={AICoachScreen}
        options={{
          presentation: 'card',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="MembersHub" 
        component={MembersHubScreen}
        options={{
          presentation: 'card',
          animation: 'slide_from_right',
        }}
      />
    </Stack.Navigator>
  );
}

function AppContent() {
  const [showSplash, setShowSplash] = useState(true);
  const { user, isLoading } = useSupabaseAuth();
  const { isDarkMode } = useTheme();

  // Initialize members database
  useEffect(() => {
    initMembersDatabase().catch(error => {
      console.error('Failed to initialize members database:', error);
    });
  }, []);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (isLoading) {
    return null;
  }

  return (
    <>
      <NavigationContainer>
        {user ? <MainStack /> : <AuthStack />}
      </NavigationContainer>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <SupabaseAuthProvider>
          <AppContent />
        </SupabaseAuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
