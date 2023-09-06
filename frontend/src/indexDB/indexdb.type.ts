export enum IconTypeJson {
  Email = 'Email',
  Phone = 'Phone',
  Notes = 'Notes',
  Documents = 'Documents',
  Tags = 'Tags',
  Activity = 'Activity',
  Edit = 'Edit',
  View = 'View',
  Lead = 'Lead',
  Deal = 'Deal',
  Account = 'Account',
  Contact = 'Contact',
  Notification = 'Notification',
  Close = 'Close',
  Search = 'Search',
  Dashboard = 'Dashboard',
  Calendar = 'Calendar',
  Settings = 'Settings',
  Streams = 'Streams',
  Logout = 'Logout',
  Filter = 'Filter',
  Group = 'Group',
  Sort = 'Sort',
  Column = 'Column',
  Message = 'Message',
  Emoji = 'Emoji',
  Pin = 'Pin',
  Reply = 'Reply',
  ReplyAll = 'ReplyAll',
  Forward = 'Forward',
  Link = 'Link',
  Info = 'Info',
  ListView = 'ListView',
  KanbanView = 'KanbanView',
  Clock = 'Clock',
  VideoCall = 'VideoCall',
  Meeting = 'Meeting',
  Agenda = 'Agenda',
  Guest = 'Guest',
  Availability = 'Availability',
  Collaborators = 'Collaborators',
  Timeline = 'Timeline',
  Spacing = 'Spacing',
  Public = 'Public',
  Private = 'Private',
  LineHeight40= 'LineHeight40',
  LineHeight70 = 'LineHeight70'
}

export type IconJsonType = {
  [key in IconTypeJson]?: string;
};

export interface IconData {
  iconType: string;
  iconJson: string;
}

export enum Stores {
  IconData = 'iconData',
}

export type IconSingle = {
  id: number;
  iconType: IconTypeJson;
  iconJson: string;
};
