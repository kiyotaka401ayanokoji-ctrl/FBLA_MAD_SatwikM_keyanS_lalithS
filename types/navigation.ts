import { Event } from './index';

export type RootStackParamList = {
  Main: undefined;
  EventDetail: { event: Event };
  AICoach: undefined;
  SignIn: undefined;
  SignUp: undefined;
};

export type TabParamList = {
  Dashboard: undefined;
  Calendar: undefined;
  Announcements: undefined;
  Resources: undefined;
  Profile: undefined;
};

export type EventDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EventDetail'>;