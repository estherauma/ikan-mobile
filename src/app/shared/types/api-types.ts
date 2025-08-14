

export interface AppContent {
  status:        string;
  data:          AppContentDatum[];
  errorMessages: any[];
}

export interface AppContentDatum {
  id:        string;
  deleted:   boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
  createdBy: null;
  updatedBy: null;
  deletedBy: null;
  content:   Content;
}

export interface Content {
  'en-us': EnUs;
  'id-id': EnUs;
}

export interface EnUs {
  loginform:         Form;
  commonText:        CommonText;
  passwordresetform: Form;
  languages: Languages;
}

export interface Languages {
  data:        LanguagesDatum[];
  pageName:    string;
  lastUpdated: string;
}

export interface LanguagesDatum {
  key:        string;
  label:      string;
  localeCode: string;
}

export interface CommonText {
  data:        CommonTextDatum[];
  pageName:    string;
  lastUpdated: string;
}

export interface CommonTextDatum {
  label: string;
  value: string;
}

export interface Form {
  pageName:      string;
  lastUpdated:   string;
  formQuestions: FormQuestion[];
}

export interface FormQuestion {
  key:             string;
  label:           string;
  options:         null;
  helptext:        null;
  questionType:    string;
  displayquestion: boolean;
}

export enum StorageKeys {
  appContent = 'appContent',
  currentLanguage = 'currentLanguage',
  isFirstLogin = 'isFirstLogin',
  apiToken = 'apiToken',
  userData = 'userData',
  apiTokenExpiry = 'apiTokenExpiry',
  pushNotificationData = 'pushNotificationData',
  pushNotificationTopics = 'pushNotificationTopics',
  pushNotificationDataUploaded = 'pushNotificationDataUploaded',
  showPNsPermissionsPrompt = 'showPNsPermissionsPrompt',
  survey = 'survey',
  surveyCategories = 'surveyCategories',
  watchedTFAVideo = 'watchedTFAVideo',
  isRoleSet = 'isRoleSet',
  currentUserOnlineContractsAppRefs = 'currentUserOnlineContracts',
  currentUserContracts = 'currentUserContracts',
  completedConsentForms = 'completedConsentForms',
  offlineAnalyticsEvents = 'offlineAnalyticsEvents',
  seenWelcomeScreens = 'seenWelcomeScreens',
  skippedWelcomeScreens = 'skippedWelcomeScreens',
  seenAppTutorials = 'seenAppTutorials',
  skippedAppTutorials = 'skippedAppTutorials',
  learningHubProgress = 'learningHubProgress',
}

export interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  roles?: UserRole[];
}
export interface LoginSuccessReponse {
  status: string;
  data:   Data;
}

export interface Data {
  token:        string;
  isFirstLogin: boolean;
  userData: UserData;
}

export enum UserRole {
  vesselOwner = 'vessel_owner',
  taiwaneseAgent = 'taiwanese_agent',
  indonesianAgent = 'indonesian_agent',
  worker = 'worker',
  buyer = 'buyer',
  public = 'public',
}

export interface Blameable {
  id: number;
  onlineRef: string;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number;
}

export type TPaymentStatus = 'default' | 'warning' | 'success' | 'failed';

export interface IPaymentsSummary {
  amount: string;
  status: TPaymentStatus;
  text: string;
}

export enum FieldType{
  text =  'text',
  password = 'password',
}

export enum Icons {
  iconEyeClosed =  'assets/icon/password/eye.svg',
  iconEyeOpen = 'assets/icon/password/eye-cross.svg'
}


export interface PushNotificationData {
  appId: string;
  userRole: string;
  language?: string;
  locale?: string; // to remove ??
  registrationToken: string;
  messagingRepos?: Array<string>;
  vessels?: Array<string>;
  userId?: string;
  tokenExpired?: boolean;
}

export interface IPasswordResetResp {
  status: string;
  message: string;
}

export enum SurveySources {
  notification = 'notification',
  fromMenu = 'fromMenu',
}

export enum NotificationActionId {
  feeeback = 'feedback',
  survey = 'survey',
  test = 'test',
}

export interface AnalyticsEventsData {
  appLanguage: string;
  role: string;
  isIos: boolean;
  isAndroid: boolean;
  accountId: string;
  deviceId: string;
  createdAt: number;
  data?: any;
}

export enum HubQuestionStatus {
  pending = 'pending',
  completed = 'completed',
  answeredYes = 'answeredYes',
  answeredNo = 'answeredNo',
  answeredMaybe = 'answeredMaybe',
}
