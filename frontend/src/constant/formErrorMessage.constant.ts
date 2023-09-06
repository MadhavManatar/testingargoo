export const phoneRegexError = Object.freeze('Must contain 10 digit number');

export const zipCodeRegexError = Object.freeze(
  'Must contain 5 to 10 digit number'
);

export const urlRegexError = Object.freeze('Please Enter Valid Url');

export const onlyNumberRegexError = Object.freeze('Please Enter Only Number');

export const faxRegexError = Object.freeze('Please Enter Valid Fax Number');

export const responseSuccessMessage = (actionType: string) => {
  return `${actionType} successfully`;
};

export const socialMediaProfileRegexError = (socialType: string) =>
  `Please enter valid ${socialType} profile url`;

enum PhoneError {
  required = 'Phone is required',
  valid = 'Must contain 10 digit number',
  phoneType = 'Please select phone type',
}

export enum EmailError {
  required = 'Email is required',
  valid = 'Email is not in valid format',
}

export enum BusinessEmailError {
  required = 'Business email is required',
  valid = 'Business email is not in valid format',
}

export enum PasswordError {
  required = 'Password is required',
  valid = 'Must contain 12 characters, one uppercase, one lowercase, one number and one special case character',
  confirm_required = 'Password confirmation required',
  match = 'Passwords must match',
  min = 'Password must be at least 8 characters',
}

enum ZipCodeError {
  min = 'Enter minimum 5 digits',
  valid = 'Must contain 5 to 10 digit number',
}

enum RelatedContactError {
  job_role = 'Enter Relation for this Contact',
  contact = 'Please select contact',
}

enum RelatedAccountError {
  job_role = 'Enter This Contacts Role for this Account',
  account = 'Please select account',
}

export enum DurationError {
  required = 'Duration is required',
  max = 'Please enter duration below 1440',
  valid = 'Please enter duration in number',
  min = 'Duration must be greater then 0',
  durationType = 'Please select duration type',
  notificationType = 'Please select notification type',
}

export enum BasicErrorMessage {
  numberOnly = 'Please enter only number',
  url = 'Please enter valid url',
  name = 'Name is required',
  first_name = 'First name is required',
  last_name = 'Last name is required',
  organization = 'Organization is required',
  owner = 'Owner is required',
  timezone = 'TimeZone is required',
  temperature = 'Temperature is required',
  status = 'Status is required',
  fax = 'Please enter valid fax number',
  color = 'Color is required',
  valid_number = 'Please enter a valid number',
}

/* ----------------------- Login Error Messages -----------------------------------*/
export const LoginSchemaError = Object.freeze({
  email: EmailError,
  password: PasswordError.required,
});

export const OrganizationSchemaError = Object.freeze({
  organization: BasicErrorMessage.organization,
});

/* ----------------------- Register Schema Error Messages -------------------------*/
export const RegisterSchemaError = Object.freeze({
  firstName: BasicErrorMessage.first_name,
  lastName: BasicErrorMessage.last_name,
  businessEmail: BusinessEmailError,
  password: PasswordError,
  agreeTerms: 'Please agree with t&c',
  organizationName: BasicErrorMessage.organization,
});

/* ----------------------- Assign Tag Schema Error Messages -----------------------*/
export const AssignTagSchemaError = Object.freeze({
  min: 'Please select at least one tag',
  required: 'Tag is required',
});

/* ----------------------- Email Schema Error Messages ----------------------------*/
export const EmailUndoTimeSchemaError = Object.freeze({
  delay_time: {
    required: DurationError.required,
    valid: DurationError.valid,
  },
});

export const EmailComposerSchemaError = Object.freeze({
  to: 'Recipient is required',
  html: 'Email content is required',
});

export const EmailTemplateSchemaError = Object.freeze({
  template_name: 'Template name is required',
  subject: 'Subject is required',
  description: 'Body is required',
});

/* ----------------------- User Schema Error Messages -----------------------------*/
export const UserSchemaErrorMessage = Object.freeze({
  name: BasicErrorMessage.name,
  first_name: BasicErrorMessage.first_name,
  last_name: BasicErrorMessage.last_name,
  phone: PhoneError,
  mobile: PhoneError,
  email: EmailError,
  profile: 'Profile is required',
  zip: ZipCodeError,
  facebook: socialMediaProfileRegexError('facebook'),
  linkedin: socialMediaProfileRegexError('linkedIn'),
  twitter: socialMediaProfileRegexError('twitter'),
  url: BasicErrorMessage.url,
  numberOnly: BasicErrorMessage.numberOnly,
  fax: BasicErrorMessage.fax,
});

/* ----------------------- Company Settings Schema Error Messages -----------------*/
export const CompanySettingsSchemaError = Object.freeze({
  name: 'Business name is required',
  phone: 'Business phone is required',
  organization_category: 'Industry is required',
  email: BusinessEmailError.required,
});

/* ----------------------- Department Schema Error Messages -----------------------------*/
export const DepartMentSchemaError = Object.freeze({
  name: BasicErrorMessage.name,
  departmentAdmin: 'Admin is required',
});

/* ----------------------- Lead Schema Error Messages -----------------------------*/
export const LeadSchemaErrorMessage = Object.freeze({
  name: BasicErrorMessage.name,
  owner: BasicErrorMessage.owner,
  status: BasicErrorMessage.status,
  temperature: BasicErrorMessage.temperature,
  contacts: RelatedContactError,
});

/* ----------------------- Contact Schema Error Messages --------------------------*/
export const ContactSchemaErrorMessage = Object.freeze({
  phone: PhoneError,
  email: EmailError,
  contact_owner_id: BasicErrorMessage.owner,
  timezone: BasicErrorMessage.timezone,
  related_contacts: RelatedContactError,
  related_accounts: RelatedAccountError,
});

/* ----------------------- Deal Schema Error Messages -----------------------------*/
export const DealSchemaErrorMessage = Object.freeze({
  lead_owner_id: BasicErrorMessage.owner,
  name: BasicErrorMessage.name,
  pipeline_id: 'Pipeline is required',
  stage: 'Stage is required',
  lead_status_id: BasicErrorMessage.status,
  contacts: RelatedContactError,
  probability: 'Please enter valid probability',
  reason: 'Lost reason is required',
  comment_memo: 'Memo is required',
});

export const DealPipelineSchemaError = Object.freeze({
  name: BasicErrorMessage.name,
  stages: {
    name: 'Stage name is required',
    probability: {
      valid: BasicErrorMessage.valid_number,
      required: 'Probability is required',
      max: 'Probability limits to 100',
    },
    stage_type: 'Stage type is required',
    nameUnique: 'Stage name is already used',
  },
  rot_days: {
    integer: 'No. of days should be in natural number only',
    max: 'No. of days should be less then 1000',
    valid: BasicErrorMessage.valid_number,
  },
});

/* ----------------------- Account Schema Error Messages --------------------------*/
export const AccountSchemaErrorMessage = Object.freeze({
  account_owner_id: BasicErrorMessage.owner,
  name: BasicErrorMessage.name,
  phone: PhoneError,
  email: EmailError,
  related_contact: RelatedContactError,
  employees: 'Please enter employee in digits',
});

/* ----------------------- Activity Schema Error Messages -------------------------*/
export const ActivitySchemaErrorMessage = Object.freeze({
  start_date: 'Start date is required',
  duration: DurationError,
  topic: 'Title is required',
  assigned_to_id: 'Assigned to is required',
  activity_type_id: 'Type is required',
  notifications: {
    duration: DurationError,
    durationType: DurationError.durationType,
    notificationType: DurationError.notificationType,
  },
});

export const MarkAsDoneActivitySchemaError = Object.freeze({
  result: 'Result is required',
  other_result: 'Other result is required',
  memo: 'Memo is required',
});

export const ActivityResultsSchemaError = Object.freeze({
  name: BasicErrorMessage.name,
  activity_types: {
    min: 'Please select at least one type',
    required: ActivitySchemaErrorMessage.activity_type_id,
  },
});

export const ActivityAvailabilitySchemaError = Object.freeze({
  required: 'Availability is required',
  valid: 'Enter valid availability',
});

export const ActivityTypeSchemaError = Object.freeze({
  name: BasicErrorMessage.name,
  parent_type: 'Parent activity type is required',
  color: BasicErrorMessage.color,
});

/* ----------------------- Tag Schema Error Messages ------------------------------*/
export const TagSchemaError = Object.freeze({
  name: BasicErrorMessage.name,
  color: BasicErrorMessage.color,
});

/* ----------------------- Note Schema Error Messages -----------------------------*/
export const NoteSchemaError = Object.freeze({
  description: 'Description is required',
});

/* ----------------------- Phone Type Schema Error Messages -----------------------*/
export const PhoneType = Object.freeze('Phone type is required');

/* ----------------------- Lead Deal Source Schema Error Messages -----------------*/
export const LeadDealSourceSchemaError = Object.freeze({
  name: 'Source is required',
});

/* ----------------------- Stay In Touch Schema Error Messages --------------------*/
export const StayInTouchSchemaError = Object.freeze({
  interval: {
    valid: 'Please enter interval',
  },
  activity_type: 'Activity type is required',
  frequency: 'Frequency type is required',
  scheduled_time: {
    min: 'Scheduled time is not in valid format',
    required: 'Scheduled time is required',
  },
});

/* ----------------------- SMTP Advance Schema Error Messages --------------------*/
export const SMTPAdvanceSchemaError = Object.freeze({
  imap_host: {
    required: 'IMAP host is required',
    valid: 'Enter valid IMAP host',
  },
  imap_port: {
    number: 'You must specify a number',
    required: 'IMAP port is required',
    valid: 'Port number must be one of [993, 143]',
  },
  smtp_host: {
    required: 'SMTP host is required',
    valid: 'Enter valid SMTP host',
  },
  smtp_port: {
    valid: 'Port number must be one of [25, 465, 587, 2525]',
    number: 'You must specify a number',
    require: 'SMTP port is required',
  },
});
export const STREAM_ERROR = Object.freeze('Stream Name is required');
export const ACCESS_DENIED_MESSAGE = 'You do not have access to this module.';

export const RULES_SCHEMA_ERROR = Object.freeze({
  pass_length: 'Password must be min length 8 to max length of 16',
  ip: 'Please enter valid ip address ex. 000.000.00.00',
});

/* ----------------------- Security Setting Alert Error Messages -----------------*/
export const SecuritySettingAlertSchemaError = Object.freeze({
  delContactCount: 'Contact must be number',
  delAccountCount: 'Account must be number',
  delDealsCount: 'Deals must be number',
  delContactCountMin: 'Contact must be greater then 0',
  delAccountCountMin: 'Account must be greater then 0',
  delDealsCountMin: 'Deals must be greater then 0',
});

/* ----------------------- Comments Timeline Error Messages -----------------*/
export const CommentTimelineSchemaError = Object.freeze({
  required: 'Comment must be required',
});
