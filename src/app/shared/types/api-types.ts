

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
  currentLanguage = 'currentLanguage'
}
