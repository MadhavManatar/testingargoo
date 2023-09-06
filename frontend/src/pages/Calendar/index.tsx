// ** Import Packages **
import {
  ActionEventArgs,
  Day,
  DragAndDrop,
  DragEventArgs,
  EventRenderedArgs,
  FieldModel,
  Inject,
  Month,
  PopupOpenEventArgs,
  RenderCellEventArgs,
  Resize,
  ResizeEventArgs,
  ScheduleComponent,
  ViewDirective,
  ViewsDirective,
  Week,
} from '@syncfusion/ej2-react-schedule';
import {
  addMinutes,
  differenceInMinutes,
  endOfDay,
  format,
  isEqual,
  startOfDay,
} from 'date-fns';
import {
  JSXElementConstructor,
  ReactElement,
  ReactFragment,
  ReactPortal,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import { getSidebarIsCollapse } from 'redux/slices/commonSlice';

// ** Components **
import EditActivityModal from 'pages/Activity/components/Modal/EditActivityModal';
import MarkAsDoneModal from 'pages/Activity/components/Modal/MarkAsDoneModal';
import DashboardActivityDetailView from 'pages/Dashboard/components/DashboardActivityDetailView';
import AuthGuard from 'pages/auth/components/AuthGuard';
import QuickLookActivityCalendar from './QuickLookActivityCalendar';
import TodaysEvent from './TodaysEvent';

// ** types **
import { ActivityResponseType } from 'pages/Activity/types/activity.types';
import { activitiesResponse } from 'pages/Dashboard/types/dashboard.types';
import { QuickPropsInterface } from './calendar.types';

// ** others **
import { NOTIFICATION_TYPE } from 'constant';
import {
  BasicPermissionTypes,
  ModuleNames,
} from 'constant/permissions.constant';
import {
  useLazyGetActivitiesQuery,
  useUpdateActivityMutation,
} from 'redux/api/activityApi';

const Calendar = () => {
  // ** Hooks **
  const schedularRef = useRef<ScheduleComponent>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const sidebarIsCollapse = useSelector(getSidebarIsCollapse);

  // ** State **
  const [calendarRender, setCalendarRender] = useState<number>(0);
  const [activities, setActivities] = useState<{
    dataSource: QuickPropsInterface[];
    fields: FieldModel;
  }>({
    dataSource: [],
    fields: {
      subject: { name: 'topic' },
      startTime: { name: 'start_date' },
      endTime: { name: 'end_date' },
    },
  });
  const [showEvents, setShowEvents] = useState<boolean>(false);
  const [todaysActivities, setTodayActivities] = useState<
    QuickPropsInterface[]
  >([]);
  const [initialRender, setInitialRender] = useState(true);
  const [openModal, setOpenModal] = useState<{
    add: boolean;
    edit: boolean;
    view: boolean;
    complete: boolean;
    id: number;
    activityTopic?: string;
    activityTypeId?: number;
  }>({ add: false, edit: false, complete: false, view: false, id: 0 });
  const [previousDragData, setPreviousDragData] =
    useState<Record<string, any>>();
  const [requestType, setRequestType] = useState<string>('');

  // ** APIS **
  const [getActivitiesAPI, { currentData, error }] =
    useLazyGetActivitiesQuery();
  const [updateActivityByIdAPI] = useUpdateActivityMutation();

  useEffect(() => {
    fetchFilterActivity();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setCalendarRender(Math.random());
    }, 300);
  }, [sidebarIsCollapse]);

  useEffect(() => {
    if (!error && currentData?.rows) {
      setTimeout(() => {
        const activityList = currentData?.rows?.map((activity: any) => {
          const reminder = (activity?.notifications || []).map(
            (item: { durationType: number; duration: number }) => {
              const durationTypeLabel = NOTIFICATION_TYPE?.find(
                (val) => val.value === item?.durationType
              )?.label;
              return `${item?.duration} ${durationTypeLabel} Before`;
            }
          );

          return {
            activityId: activity.id,
            end_date: addMinutes(
              new Date(activity.start_date),
              activity.duration
            ),
            start_date: activity.start_date,
            is_visibility: activity.is_visibility,
            topic: activity.topic,
            activity_type: activity?.activity_type,
            duration: activity?.duration,
            join_link: activity?.zoom_meeting_details?.join_url,
            reminder,
            is_active: activity?.is_active,
            completed: !!activity?.completed_by,
            completed_by: activity?.completed_by,
            activity_type_id: activity?.activity_type_id,
            agenda: activity?.agenda,
            activity_contact: activity?.activity_contact,
            activity_lead: activity?.activity_lead,
            activity_account: activity?.activity_account,
          };
        });

        const calendarActivityData = activityList.filter(
          (element: { is_visibility: boolean }) => element.is_visibility
        );

        setActivities({ ...activities, dataSource: [...calendarActivityData] });
        if (
          !['dateNavigate', 'viewNavigate'].includes(requestType || '') &&
          initialRender
        ) {
          setTodayActivities(
            activityList.filter(
              (element: {
                start_date: string | number | Date;
                is_visibility: boolean;
              }) =>
                startOfDay(new Date(element.start_date)) >=
                startOfDay(new Date()) &&
                endOfDay(new Date(element.start_date)) <=
                endOfDay(new Date()) &&
                element.is_visibility === true
            )
          );
        }
      }, 50);
    }
  }, [currentData, requestType, initialRender]);

  // ** fetch filtered activities  **
  const fetchFilterActivity = async () => {
    if (schedularRef.current) {
      // ====
      const { currentView } = schedularRef.current;
      const dateRange = schedularRef.current.getCurrentViewDates();
      const [firstDate] = dateRange;

      let startDate;
      let endDate;
      if (currentView === 'Day') {
        startDate = firstDate;
        endDate = endOfDay(startDate);
      } else if (currentView === 'Week') {
        startDate = firstDate;
        endDate = endOfDay(dateRange[6]);
      } else if (currentView === 'Month') {
        startDate = new Date(dateRange[0]);
        endDate = new Date(dateRange[dateRange.length - 1]);
      } else {
        startDate = firstDate;
        endDate = dateRange[dateRange.length - 1];
      }
      await getActivitiesAPI(
        {
          data: {
            query: {
              'q[start_date][gte]': startDate,
              'q[start_date][lte]': endDate,
              'include[activity_type][select]': 'icon,icon_type,name,id,color',
              limit: 1000,
              sort: 'start_date',
            },
          },
        },
        true
      );
    }
  };

  // ** Update activity on Drag And Resize ** //
  const onResizeStop = (args: ResizeEventArgs) => {
    updatedActivityOnDragAndResizeStop(args);
  };

  const onDragStop = (args: DragEventArgs) => {
    const currentView = schedularRef.current?.currentView;

    // whenever someone drag and drop it on where it's already placed then we don't have to update the activity
    if (
      (currentView === 'Month' &&
        !isEqual(
          new Date(new Date(args.data?.start_date).setHours(0, 0, 0, 0)),
          new Date(new Date(previousDragData?.start_date).setHours(0, 0, 0, 0))
        )) ||
      (currentView !== 'Month' &&
        !isEqual(args.data?.start_date, previousDragData?.start_date))
    ) {
      updatedActivityOnDragAndResizeStop(args);
    }
  };

  const updatedActivityOnDragAndResizeStop = async (
    args: ResizeEventArgs | DragEventArgs
  ) => {
    const { activityId, start_date, end_date } = args.data;
    await updateActivityByIdAPI({
      id: activityId,
      data: {
        start_date: new Date(start_date).toISOString(),
        duration: differenceInMinutes(end_date, start_date),
      },
    });
    fetchFilterActivity();
  };

  const dayWeekHeaderTemplate = (args: any) => {
    if (args.date) {
      return (
        <div>
          <p>{format(args.date, 'dd')}</p>
          <p>{format(args.date, 'EEE')}</p>
        </div>
      );
    }
  };

  function contentTemplate(props: QuickPropsInterface): JSX.Element {
    if (props?.elementType === 'cell') {
      const elm = document.querySelector('.e-cell-popup') as HTMLElement;
      if (elm?.style) {
        elm.style.display = 'none';
      }
    }

    const headerElm = document.querySelector('.e-popup-header') as HTMLElement;
    const footerElm = document.querySelector('.e-popup-footer') as HTMLElement;
    const modalElm = document.querySelector('.e-event-popup') as HTMLElement;

    if (headerElm && footerElm && modalElm) {
      footerElm.remove();
      headerElm.remove();
      modalElm.classList.remove('e-event-popup');
    }

    const {
      activityId,
      activity_type,
      duration,
      join_link,
      topic,
      start_date,
      reminder,
      is_active,
      completed_by,
      activity_type_id,
      end_date,
      all_day,
      activity_contact,
      activity_lead,
      activity_account,
      agenda,
    } = props;

    const showQuickActivityData: activitiesResponse = {
      id: activityId,
      activity_type,
      duration,
      join_link,
      topic,
      activity_type_id,
      activity_lead,
      start_date: start_date.toString(),
      activity_participants: [],
      activity_contact,
      is_active,
      completed_by,
      end_date: end_date.toString(),
      all_day,
      activity_account,
      agenda,
    };

    return (
      <>
        {props?.elementType === 'cell' ? (
          <></>
        ) : (
          <QuickLookActivityCalendar
            {...{
              setOpenModal,
              refreshPage,
              reminder,
              showQuickActivityData,
              schedularRef,
            }}
          />
        )}
      </>
    );
  }

  const header = () => '';

  const footer = () => '';

  const onPopUpOpen = (args: PopupOpenEventArgs) => {
    const typesArray = ['QuickInfo', 'EditEventInfo', 'EventContainer'];

    if (!typesArray.includes(args?.type)) {
      args.cancel = true;
    }
    if (args?.type === 'QuickInfo' && !args?.data?.activityId) {
      args.cancel = true;
    }
  };

  const onRenderCell = (args: RenderCellEventArgs) => {
    if (args.element.classList.contains('e-other-month')) {
      args.element.classList.add('e-disable-dates');
      args.element.classList.add('e-disable-cell');
      args.element.classList.remove('e-other-month');
      args.element.classList.remove('e-work-days');
    }
  };

  const refreshPage = () => {
    fetchFilterActivity();
  };

  const closeModal = (data?: any) => {
    modalRef.current?.style.removeProperty('display');

    if (data) {
      setOpenModal({
        add: false,
        edit: false,
        complete: false,
        id: data?.id,
        activityTypeId: data?.activity_type?.id,
        activityTopic: data?.topic,
        view: !openModal?.edit,
      });
    } else if (openModal.edit) {
      setOpenModal({
        add: false,
        edit: false,
        complete: false,
        id: data?.id || openModal.id,
        activityTypeId: data?.activity_type?.id || openModal?.activityTypeId,
        activityTopic: data?.topic || openModal?.activityTopic,
        view: !openModal?.edit,
      });
    } else {
      setOpenModal({
        add: false,
        edit: false,
        id: 0,
        complete: false,
        view: false,
      });
      refreshPage();
    }
  };

  const onDataBound = () => {
    const currTime: Date = new Date();
    const hours =
      currTime.getHours() < 10
        ? `0${(currTime.getHours() - 4).toString()}`
        : (currTime.getHours() - 4).toString();
    const minutes = currTime.getMinutes().toString();
    const time = `${hours}:${minutes}`;

    schedularRef.current?.scrollTo(time, new Date());
  };

  function changeColorOpacity(bg_color: string, amount: number) {
    return `#${bg_color
      .replace(/^#/, '')
      .replace(/../g, (color: string) =>
        `0${Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(
          16
        )}`.substr(-2)
      )}`;
  }

  function onEventRendered(args: EventRenderedArgs): void {
    if (args?.data?.activity_type?.color) {
      args.element.style.setProperty(
        'background-color',
        changeColorOpacity(args?.data?.activity_type?.color, 90),
        'important'
      );

      args.element.style.setProperty(
        'border-left',
        `2px solid ${changeColorOpacity(args?.data?.activity_type?.color, 90)}`,
        'important'
      );
    }
  }

  const cellHeaderTemplate = (props: {
    date: {
      getDate: () =>
        | string
        | number
        | boolean
        | ReactElement<any, string | JSXElementConstructor<any>>
        | ReactFragment
        | ReactPortal
        | null
        | undefined;
    };
  }) => {
    return (
      <div className="e-cell-header">
        <div className="e-day">{props.date.getDate()}</div>
      </div>
    );
  };

  return (
    <>
      <div className="calendar__page flex flex-wrap items-start">
        <div className="calendar__wrapper w-[calc(100%_-_440px)] 3xl:w-[calc(100%_-_350px)] xl:w-full">
          <ScheduleComponent
            key={calendarRender}
            showTimeIndicator
            enableAllDayScroll
            dataBound={onDataBound}
            dateFormat="ddd MMM yyyy"
            ref={schedularRef}
            popupOpen={onPopUpOpen}
            timezone={Intl.DateTimeFormat().resolvedOptions().timeZone}
            actionComplete={(data: ActionEventArgs) => {
              if (
                ['dateNavigate', 'viewNavigate', 'eventChanged'].includes(
                  data.requestType
                )
              ) {
                setRequestType(data?.requestType);
                fetchFilterActivity();
              }
            }}
            height="100%"
            currentView="Month"
            eventSettings={activities}
            resizeStop={onResizeStop}
            dragStart={(args: DragEventArgs) => setPreviousDragData(args.data)}
            dragStop={onDragStop}
            quickInfoTemplates={{
              header: header as any,
              content: contentTemplate as any,
              footer: footer as any,
            }}
            renderCell={onRenderCell}
            // eslint-disable-next-line react/jsx-no-bind
            eventRendered={onEventRendered}
          >
            <ViewsDirective>
              <ViewDirective
                option="Day"
                dateHeaderTemplate={dayWeekHeaderTemplate}
              />
              <ViewDirective
                option="Week"
                dateHeaderTemplate={dayWeekHeaderTemplate}
              />
              <ViewDirective
                option="Month"
                dateHeaderTemplate={dayWeekHeaderTemplate}
                cellHeaderTemplate={cellHeaderTemplate}
              />
            </ViewsDirective>
            <Inject services={[Day, Month, Week, DragAndDrop, Resize]} />
          </ScheduleComponent>
        </div>
        <TodaysEvent
          {...{
            setShowEvents,
            showEvents,
            todaysActivities,
            setOpenModal,
            setInitialRender,
          }}
        />
      </div>

      {openModal.edit ? (
        <AuthGuard
          permissions={[
            { module: ModuleNames.ACTIVITY, type: BasicPermissionTypes.UPDATE },
          ]}
        >
          <EditActivityModal
            id={openModal.id}
            isOpen={openModal.edit}
            onEdit={(data: any) => {
              fetchFilterActivity();
              closeModal(data);
            }}
            closeModal={closeModal}
          />
        </AuthGuard>
      ) : (
        <></>
      )}

      {/* mark as done Modal */}
      {openModal.complete ? (
        <AuthGuard
          permissions={[
            { module: ModuleNames.ACTIVITY, type: BasicPermissionTypes.UPDATE },
          ]}
        >
          <MarkAsDoneModal
            isOpen={openModal.complete}
            closeModal={closeModal}
            onAdd={refreshPage}
            activityId={openModal.id}
            activityTypeId={openModal.activityTypeId}
          />
        </AuthGuard>
      ) : (
        <></>
      )}

      {openModal.view ? (
        <DashboardActivityDetailView
          isOpen={openModal.view}
          closeViewModal={(activityDetail?: ActivityResponseType) => {
            closeModal(activityDetail);
            setInitialRender(true)
          }}
          activityId={openModal.id}
          activityTopic={openModal.activityTopic || ''}
          closeModalForDashboard={() => {
            if (modalRef.current) {
              modalRef.current.style.display = 'none';
            }
          }}
          modalRef={modalRef}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default Calendar;
