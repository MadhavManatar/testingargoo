// ** Import Packages **1
import { createApi } from '@reduxjs/toolkit/query/react';

// ** Axios **
import { axiosBaseQuery } from 'axios/axios';

const baseQueryApi = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery,
  tagTypes: [
    'MAIL',
    'GENERAL_SETTING',
    'ENTITY_ATTRIBUTE',
    'SNIPPET_SETTING',
    'SNIPPET_CATEGORY',
    'TAG',
    'NOTIFICATION',
    'NOTIFICATION_SETTING',
    'TRASH',
    'TIMEZONE',
    'CONTACT',
    'ACTIVITY',
    'ACTIVITY_TYPE',
    'ADDRESS',
    'ATTACHMENT',
    'PIPELINE',
    'ACTIVITY_RESULT',
    'ZOOM',
    'FILE',
    'NOTE',
    'SEARCH',
    'ROLE',
    'PROFILE',
    'PERMISSIONS_TYPE',
    'DEPARTMENT',
    'COMPANY_DETAIL',
    'USER',
    'SCHEDULE_ACTIVITY',
    'EMAIL_LINK_ENTITY',
    'COMPOSE_MAIL_CONNECT_ENTITY',
    'EMAIL_TEMPLATE',
    'TIMELINE',
    'FIELD_IS_EXIST',
    'COLUMN',
    'COLUMN_VIEWS',
    'STREAM',
    'ORGANIZATION_SETTING',
    'HIERARCHY',
    'HIERARCHY_BLOCK',
    'ORG_DEPARTMENT',
    'ORGANIZATION_ALERTS',
    'USER_SESSION',
  ],
  endpoints: () => ({}),
});

export default baseQueryApi;
