// ** types **

import { convertPluralToSingularModalName } from 'components/EntityDetails/Timeline/helper';
import {
  TIMELINE_ACTION,
  TimelineType,
  NoteTimeline as NoteTimelineType,
} from 'components/EntityDetails/Timeline/types';

import RedirectsLinks from './RedirectsLinks';
import { TimelineModelName } from 'constant/timeline.constant';
import DocumentTimeline from 'components/EntityDetails/Timeline/DocumentTimeline';
import NoteTimeline from 'components/EntityDetails/Timeline/NoteTimeLine';

interface Props {
  timeLineData: TimelineType;
  setIsDocument?: React.Dispatch<React.SetStateAction<boolean>>;
}

const RecentLogsData = (props: Props) => {
  const { timeLineData, setIsDocument } = props;

  const userName = `${timeLineData.creator.first_name} ${timeLineData.creator.last_name}`;

  const { action, message, model_name, model_record_id, relation_model_name } =
    timeLineData;

  const newValue =
    (message?.newValue?.value === 'Blank'
      ? 'Blank Value'
      : message?.newValue?.value) ?? 'Blank Value';

  const getRecordLabel = () => {
    switch (model_name) {
      case TimelineModelName.ACCOUNT:
        return timeLineData?.accounts?.name;
      case TimelineModelName.ACTIVITY:
        return timeLineData?.related_activities?.topic;
      case TimelineModelName.CONTACT:
        return timeLineData?.contacts?.name;
      case TimelineModelName.LEAD:
        return timeLineData?.leads?.name;
      case TimelineModelName.DEAL:
        return timeLineData?.leads?.name;

      default:
        return '';
    }
  };

  const getRecordId = () => {
    switch (model_name) {
      case TimelineModelName.ACCOUNT:
        return timeLineData?.accounts?.id;
      case TimelineModelName.ACTIVITY:
        return timeLineData?.related_activities?.id;
      case TimelineModelName.CONTACT:
        return timeLineData?.contacts?.id;
      case TimelineModelName.LEAD:
        return timeLineData?.leads?.id;
      case TimelineModelName.DEAL:
        return timeLineData?.leads?.id;

      default:
        return '';
    }
  };

  switch (action) {
    case TIMELINE_ACTION.CREATE:
      if (relation_model_name === 'notes') {
        return (
          <h4 className="text-[16px] leading-[20px] font-biotif__Regular text-sdNormal__textColor mt-[9px] mb-[7px]">
            <span className="text-darkTextColorSD">{userName}</span> added note
            to {convertPluralToSingularModalName(model_name)}{' '}
            <NoteTimeline note={timeLineData?.note as NoteTimelineType} />{' '}
            {getRecordLabel() ? (
              <>
                <RedirectsLinks
                  model_name={model_name}
                  model_record_id={model_record_id}
                  record_label={`${getRecordLabel()}`}
                />
              </>
            ) : null}
          </h4>
        );
      }

      if (
        relation_model_name === 'documents' &&
        timeLineData.documents?.length
      ) {
        return (
          <h4 className="text-[16px] leading-[20px] font-biotif__Regular text-sdNormal__textColor mt-[9px] mb-[7px]">
            <span className="text-darkTextColorSD">{userName}</span> added
            document to {convertPluralToSingularModalName(model_name)}{' '}
            <DocumentTimeline
              setIsDocument={setIsDocument}
              documents={timeLineData.documents}
              key={window.crypto.randomUUID()}
            />
          </h4>
        );
      }

      if (relation_model_name === 'tags') {
        return (
          <h4 className="text-[16px] leading-[20px] font-biotif__Regular text-sdNormal__textColor mt-[9px] mb-[7px]">
            <span className="text-darkTextColorSD">{userName}</span> Created tag
            list in {convertPluralToSingularModalName(model_name)}{' '}
            <RedirectsLinks
              model_name={model_name}
              model_record_id={model_record_id}
              record_label={`${getRecordLabel()}`}
            />
          </h4>
        );
      }

      if (message?.fieldName === '---ScHeDuLed---AcTiViTy---TiMeLiNe---') {
        return (
          <>
            <h4 className="text-[16px] leading-[20px] font-biotif__Regular text-sdNormal__textColor mt-[9px] mb-[7px]">
              <span className="text-darkTextColorSD">{userName}</span> scheduled{' '}
              {convertPluralToSingularModalName(model_name)}{' '}
              <RedirectsLinks
                model_name={model_name}
                model_record_id={model_record_id}
                record_label={`${newValue}`}
              />{' '}
            </h4>
          </>
        );
      }

      return (
        <h4 className="text-[16px] leading-[20px] font-biotif__Regular text-sdNormal__textColor mt-[9px] mb-[7px]">
          <span className="text-darkTextColorSD">{userName}</span> created{' '}
          {convertPluralToSingularModalName(model_name)}{' '}
          <RedirectsLinks
            model_name={model_name}
            model_record_id={model_record_id}
            record_label={`${newValue}`}
          />{' '}
        </h4>
      );

    case TIMELINE_ACTION.RESTORED:
      if (relation_model_name === 'notes') {
        return (
          <h4 className="text-[16px] leading-[20px] font-biotif__Regular text-sdNormal__textColor mt-[9px] mb-[7px]">
            <span className="text-darkTextColorSD">{userName}</span> restored
            note to {convertPluralToSingularModalName(model_name)}{' '}
            <NoteTimeline note={timeLineData?.note as NoteTimelineType} />{' '}
            {getRecordLabel() ? (
              <>
                <RedirectsLinks
                  model_name={model_name}
                  model_record_id={model_record_id}
                  record_label={`${getRecordLabel()}`}
                />
              </>
            ) : null}
          </h4>
        );
      }

      if (
        relation_model_name === 'documents' &&
        timeLineData.documents?.length
      ) {
        return (
          <h4 className="text-[16px] leading-[20px] font-biotif__Regular text-sdNormal__textColor mt-[9px] mb-[7px]">
            <span className="text-darkTextColorSD">{userName}</span> restored
            document to {convertPluralToSingularModalName(model_name)}{' '}
            <DocumentTimeline
              setIsDocument={setIsDocument}
              documents={timeLineData.documents}
              key={window.crypto.randomUUID()}
            />
          </h4>
        );
      }

      if (relation_model_name === 'tags') {
        return (
          <h4 className="text-[16px] leading-[20px] font-biotif__Regular text-sdNormal__textColor mt-[9px] mb-[7px]">
            <span className="text-darkTextColorSD">{userName}</span> Restore tag
            list in {convertPluralToSingularModalName(model_name)}{' '}
            <RedirectsLinks
              model_name={model_name}
              model_record_id={model_record_id}
              record_label={`${getRecordLabel()}`}
            />
          </h4>
        );
      }

      if (message?.fieldName === '---ScHeDuLed---AcTiViTy---TiMeLiNe---') {
        return (
          <>
            <h4 className="text-[16px] leading-[20px] font-biotif__Regular text-sdNormal__textColor mt-[9px] mb-[7px]">
              <span className="text-darkTextColorSD">{userName}</span> scheduled{' '}
              {convertPluralToSingularModalName(model_name)}{' '}
              <RedirectsLinks
                model_name={model_name}
                model_record_id={model_record_id}
                record_label={`${newValue}`}
              />{' '}
            </h4>
          </>
        );
      }

      return (
        <h4 className="text-[16px] leading-[20px] font-biotif__Regular text-sdNormal__textColor mt-[9px] mb-[7px]">
          <span className="text-darkTextColorSD">{userName}</span> restored{' '}
          {convertPluralToSingularModalName(model_name)}{' '}
          <RedirectsLinks
            model_name={model_name}
            model_record_id={model_record_id}
            record_label={`${newValue}`}
          />{' '}
        </h4>
      );

    case TIMELINE_ACTION.UPDATE:
      if (message?.fieldName === 'Completed By') {
        return (
          <h4 className="text-[16px] leading-[20px] font-biotif__Regular text-sdNormal__textColor mt-[9px] mb-[7px]">
            <span className="text-darkTextColorSD">{userName}</span> marked
            activity{' '}
            <RedirectsLinks
              model_name={model_name}
              model_record_id={model_record_id}
              record_label={`${getRecordLabel()}`}
            />{' '}
            as done
          </h4>
        );
      }

      if (message?.fieldName === 'Assign To') {
        return (
          <h4 className="text-[16px] leading-[20px] font-biotif__Regular text-sdNormal__textColor mt-[9px] mb-[7px]">
            <span className="text-darkTextColorSD">{userName}</span> assign{' '}
            {convertPluralToSingularModalName(model_name)}{' '}
            <RedirectsLinks
              model_name={model_name}
              model_record_id={model_record_id}
              record_label={`${getRecordLabel()}`}
            />{' '}
            to {newValue}
          </h4>
        );
      }
      return (
        <h4 className="text-[16px] leading-[20px] font-biotif__Regular text-sdNormal__textColor mt-[9px] mb-[7px]">
          <span className="text-darkTextColorSD">{userName}</span> updated{' '}
          {(message?.fieldName || '')?.toLocaleLowerCase()} for{' '}
          {convertPluralToSingularModalName(model_name)}{' '}
          <RedirectsLinks
            model_name={model_name}
            model_record_id={model_record_id}
            record_label={`${getRecordLabel()}`}
          />{' '}
        </h4>
      );

    case TIMELINE_ACTION.ASSIGN:
      if (message.fieldName === '---ScHeDuLed---AcTiViTy---TiMeLiNe---') {
        return (
          <h4 className="text-[16px] leading-[20px] font-biotif__Regular text-sdNormal__textColor mt-[9px] mb-[7px]">
            <span className="text-darkTextColorSD">{userName}</span> scheduled
            activity{' '}
            <RedirectsLinks
              model_name={TimelineModelName.ACTIVITY}
              model_record_id={timeLineData?.activities?.id}
              record_label={timeLineData?.activities?.topic}
            />{' '}
            to {convertPluralToSingularModalName(model_name)}{' '}
            <RedirectsLinks
              model_name={model_name}
              model_record_id={getRecordId() as number}
              record_label={`${getRecordLabel()}`}
            />
          </h4>
        );
      }

      return (
        <h4 className="text-[16px] leading-[20px] font-biotif__Regular text-sdNormal__textColor mt-[9px] mb-[7px]">
          <span className="text-darkTextColorSD">{userName}</span> linked
          activity{' '}
          <RedirectsLinks
            model_name={TimelineModelName.ACTIVITY}
            model_record_id={timeLineData?.activities?.id}
            record_label={timeLineData?.activities?.topic}
          />{' '}
          to {convertPluralToSingularModalName(model_name)}{' '}
          <RedirectsLinks
            model_name={model_name}
            model_record_id={getRecordId() as number}
            record_label={`${getRecordLabel()}`}
          />
        </h4>
      );

    case TIMELINE_ACTION.CONVERT:
      return (
        <h4 className="text-[16px] leading-[20px] font-biotif__Regular text-sdNormal__textColor mt-[9px] mb-[7px]">
          <span className="text-darkTextColorSD">{userName}</span> converted
          lead{' '}
          <RedirectsLinks
            model_name={model_name}
            model_record_id={model_record_id}
            record_label={(message?.oldValue?.value as string) || ''}
          />{' '}
          to {convertPluralToSingularModalName(model_name)}{' '}
          <RedirectsLinks
            model_name={model_name}
            model_record_id={model_record_id}
            record_label={`${getRecordLabel()}`}
          />
        </h4>
      );

    case TIMELINE_ACTION.DELETE:
      return (
        <h4 className="text-[16px] leading-[20px] font-biotif__Regular text-sdNormal__textColor mt-[9px] mb-[7px]">
          <span className="text-darkTextColorSD">{userName}</span> deleted{' '}
          {convertPluralToSingularModalName(model_name)}{' '}
          {(message?.newValue?.value as string) || ''}
        </h4>
      );

    case 'comment':
      return (
        <h4 className="text-[16px] leading-[20px] font-biotif__Regular text-sdNormal__textColor mt-[9px] mb-[7px]">
          <span className="text-darkTextColorSD">{userName}</span> Commented on{' '}
          {message?.fieldName}{' '}
          <RedirectsLinks
            model_name={model_name}
            model_record_id={model_record_id}
            record_label={`${getRecordLabel()}`}
          />{' '}
        </h4>
      );
    default:
      return <></>;
  }
};

export default RecentLogsData;
