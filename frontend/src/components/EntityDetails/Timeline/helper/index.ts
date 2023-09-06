// ** types **
import {
  HistoryDataChildType,
  HistoryDataTypes,
  TimelineType,
  TIMELINE_SECTION_TYPE,
} from '../types';

//  ** components **
import DateFormat from 'components/DateFormat';

// ** others **
import { formatPhoneNumber, isIsoDate, usCurrencyFormat } from 'utils/util';
import {
  TimelineModelName,
  TIMELINE_MODEL_MAPPER,
} from 'constant/timeline.constant';
import { IconTypeJson } from 'indexDB/indexdb.type';

export const timeLineNameConverter = (name: string) => {
  if (typeof name === 'string') {
    return name
      .split('_')
      .map((el) => el.charAt(0).toUpperCase() + el.slice(1).toLowerCase())
      .join(' ');
  }
  return '';
};

export const timeLineModelNameConverter = (modelName: TimelineModelName) => {
  return TIMELINE_MODEL_MAPPER[modelName];
};

export const renderIconBasedOnModuleAndAction = ({
  module = '',
}: {
  module?: string;
}) => {
  // attachment
  if (module.startsWith('documents')) {
    return 'attachmentFilledIcon';
  }
  // note
  if (module.startsWith('notes')) {
    return 'mobileMenuFilled';
  }

  // activities
  if (module.startsWith('activities')) {
    return 'activitiesFilledBlackIcon';
  }

  return 'infoFilled';
};

export const renderIconBasedOnModuleAndActionAnimation = ({
  module = '',
}: {
  module?: string;
}) => {
  // attachment
  if (module.startsWith('documents')) {
    return IconTypeJson.Documents;
  }
  // note
  if (module.startsWith('notes')) {
    return IconTypeJson.Notes;
  }
  // activities
  if (module.startsWith('activities')) {
    return IconTypeJson.Activity;
  }
  return IconTypeJson.Info;
};

export const isHistoryObjValueExist = (obj?: HistoryDataChildType) => {
  if (obj?.value || obj?.value === 0) {
    return true;
  }
  return false;
};

export const printTimeLineData = (data: HistoryDataChildType) => {
  if (isIsoDate(data.value)) {
    const isFullDate = data.type !== HistoryDataTypes.DATE;
    return DateFormat({
      date: data.value,
      ...(isFullDate && { format: 'Pp' }),
    });
  }
  if (data.type === HistoryDataTypes.MOBILE_NO) {
    return formatPhoneNumber(data.value);
  }
  if (data.type === HistoryDataTypes.CURRENCY) {
    return usCurrencyFormat(data.value) || '';
  }
  if (typeof data.value === 'string' || typeof data.value === 'number') {
    return data.value;
  }
  return '';
};

export const timelineSectionExtract = (timelines: TimelineType[]) => {
  const sections: { [key: string]: TimelineType[] } = {};

  let customIndex = 0;
  let lastKeyName = '';

  timelines?.forEach((timeline) => {
    const { relation_model_name } = timeline;
    const model_name =
      timeline?.message?.newValue?.model_name || timeline.model_name;

    if (
      model_name === TIMELINE_SECTION_TYPE.ACTIVITY &&
      timeline?.model_name !== 'activities' &&
      timeline?.message?.fieldName !== 'New Activity Created'
    ) {
      if (
        lastKeyName !== `${TIMELINE_SECTION_TYPE.ACTIVITY}-${customIndex - 1}`
      ) {
        sections[`${TIMELINE_SECTION_TYPE.ACTIVITY}-${customIndex}`] = [
          timeline,
        ];
        lastKeyName = `${TIMELINE_SECTION_TYPE.ACTIVITY}-${customIndex}`;
        customIndex++;
      } else {
        sections[`${TIMELINE_SECTION_TYPE.ACTIVITY}-${customIndex - 1}`] = [
          ...sections[`${TIMELINE_SECTION_TYPE.ACTIVITY}-${customIndex - 1}`],
          timeline,
        ];
      }
    } else if (
      relation_model_name &&
      relation_model_name !== 'tags' &&
      timeline?.message?.fieldName !== 'New Activity Created'
    ) {
      const titleOfTimeline = relation_model_name;

      if (lastKeyName !== `${titleOfTimeline}-${customIndex - 1}`) {
        sections[`${titleOfTimeline}-${customIndex}`] = [timeline];
        lastKeyName = `${titleOfTimeline}-${customIndex}`;
        customIndex++;
      } else {
        sections[`${titleOfTimeline}-${customIndex - 1}`] = [
          ...sections[`${titleOfTimeline}-${customIndex - 1}`],
          timeline,
        ];
      }
    } else if (model_name === TIMELINE_SECTION_TYPE.EMAIL) {
      if (lastKeyName !== `${TIMELINE_SECTION_TYPE.EMAIL}-${customIndex - 1}`) {
        sections[`${TIMELINE_SECTION_TYPE.EMAIL}-${customIndex}`] = [timeline];
        lastKeyName = `${TIMELINE_SECTION_TYPE.EMAIL}-${customIndex}`;
        customIndex++;
      } else {
        sections[`${TIMELINE_SECTION_TYPE.EMAIL}-${customIndex - 1}`] = [
          ...sections[`${TIMELINE_SECTION_TYPE.EMAIL}-${customIndex - 1}`],
          timeline,
        ];
      }
    } else if (
      lastKeyName !== `${TIMELINE_SECTION_TYPE.INFO}-${customIndex - 1}`
    ) {
      sections[`${TIMELINE_SECTION_TYPE.INFO}-${customIndex}`] = [timeline];
      lastKeyName = `${TIMELINE_SECTION_TYPE.INFO}-${customIndex}`;
      customIndex++;
    } else {
      sections[`${TIMELINE_SECTION_TYPE.INFO}-${customIndex - 1}`] = [
        ...sections[`${TIMELINE_SECTION_TYPE.INFO}-${customIndex - 1}`],
        timeline,
      ];
    }
  });
  return sections;
};

export const convertPluralToSingularModalName = (value: string) => {
  switch (value) {
    case TimelineModelName.ACCOUNT:
      return 'account';
    case TimelineModelName.ACTIVITY:
      return 'activity';
    case TimelineModelName.CONTACT:
      return 'contact';
    case TimelineModelName.DEAL:
      return 'deal';
    case TimelineModelName.LEAD:
      return 'lead';
    default:
      return '';
  }
};
