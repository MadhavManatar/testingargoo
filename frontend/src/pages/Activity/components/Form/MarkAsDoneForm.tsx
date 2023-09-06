// ** import packages  ** //
import { MentionComponent } from '@syncfusion/ej2-react-dropdowns';
import {
  HtmlEditor,
  Inject,
  NodeSelection,
  RichTextEditorComponent,
} from '@syncfusion/ej2-react-richtexteditor';
import { useEffect, useRef, useState } from 'react';
import {
  Control,
  Controller,
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';

// ** components ** //
import FormField from 'components/FormField';

// ** Redux **
import { useLazyGetSnippetSettingQuery } from 'redux/api/snippetSettingApi';

// ** hooks-services ** //
import { useGetActivityResultOptions } from 'pages/Setting/module-setting/Activity/ActivityResult/hooks/useGetActivityTypesService';

// ** types ** //
import { SnippetModalType } from 'pages/Setting/general-setting/common-controls/Snippet/types/snippet.types';
import { MarkAsDoneFormFields } from '../../types/activity.types';

// ** Util **
import { convertAtoB } from 'utils/util';

type MarkAsDoneFormPropsType = {
  control: Control<MarkAsDoneFormFields>;
  errors: FieldErrors<MarkAsDoneFormFields>;
  watch: UseFormWatch<MarkAsDoneFormFields>;
  setActivityResultName?: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  setValue: UseFormSetValue<MarkAsDoneFormFields>;
  activityTypeId: number | undefined;
  defaultResult: { id: number; result: string };
  isGetActivityLoading: boolean;
};

function MarkAsDoneForm(props: MarkAsDoneFormPropsType) {
  const {
    control,
    errors,
    watch,
    setActivityResultName,
    setValue,
    activityTypeId,
    defaultResult,
    isGetActivityLoading,
  } = props;

  const snippetFieldsData: { [key: string]: string } = { text: 'title' };

  const snippetRef = useRef<MentionComponent>(null);
  const textEditorRef = useRef<RichTextEditorComponent>(null);
  // ** custom hooks **

  const [getSnippetsAPI] = useLazyGetSnippetSettingQuery();
  const { getActivityResultOptions, isActivityResultsLoading, activityResult } =
    useGetActivityResultOptions({ activityTypeId });

  // ** watch **
  const is_memo_required = watch('is_memo_required');
  const result = watch('result');

  const [snippetList, setSnippetList] = useState<SnippetModalType>({
    list: [],
  });

  useEffect(() => {
    getSnippetList();
  }, []);

  useEffect(() => {
    // if (result !== 'other') {
    if (activityResult?.find((item) => item.id === Number(result))?.isMemo) {
      setValue('is_memo_required', true);
    } else {
      setValue('is_memo_required', false);
    }
    // }
  }, [result]);

  const getSnippetList = async () => {
    const { data, error } = await getSnippetsAPI(
      {
        data: {
          query: {
            limit: 100,
            'q[type][in]': ['activity_result', 'anywhere'],
            select: 'id,title,type,snippet',
          },
        },
      },
      true
    );
    if (data?.rows && !error && setSnippetList) {
      setSnippetList({ list: [...data.rows] || [] });
    }
  };

  const snippetItemTemplate = (data: any): JSX.Element => {
    const snippetTag = document.createElement('div');
    snippetTag.innerHTML = convertAtoB(data?.snippet);

    return (
      <div className="mention__li">
        <div key={data?.id} className="snippet__row w-full">
          <h3 className="snippet__title">{data?.title}</h3>
          <p className="description whitespace-pre overflow-hidden text-ellipsis">
            {snippetTag.innerText}
          </p>
        </div>
      </div>
    );
  };

  const displaySnippetTemplate = (data: any) => {
    return (
      // eslint-disable-next-line react/no-danger
      <div dangerouslySetInnerHTML={{ __html: convertAtoB(data?.snippet) }} />
    );
  };

  const handleSnippetChange = (args: {
    element: { querySelectorAll: (arg0: string) => any };
  }) => {
    const chips = args.element.querySelectorAll('.e-mention-chip');

    for (let i = 0; i < chips.length; i++) {
      const elem = chips[i].children;
      const childrenArray = Array.from(elem);
      for (let j = 0; j < childrenArray.length; j++) {
        chips[i].insertAdjacentElement('beforebegin', childrenArray[j]);
      }
      chips[i].remove();
    }
    const selection = new NodeSelection();
    const range = textEditorRef?.current?.getRange();
    if (range?.startContainer) {
      selection.setCursorPoint(
        document,
        range?.startContainer as unknown as Element,
        range?.startOffset
      );
    }
  };

  const onbegin = (args: { requestType: string; cancel: boolean }) => {
    if (args.requestType === 'EnterAction') {
      args.cancel = true;
    }
  };
  return (
    <div className="mx-[-10px]">
      <div className="px-[10px] w-full">
        <FormField<MarkAsDoneFormFields>
          wrapperClass=""
          required
          key={defaultResult?.id}
          id="done_result"
          placeholder="Select Result"
          type="asyncSelect"
          serveSideSearch
          name="result"
          label="Result"
          labelClass="if__label__blue"
          control={control}
          error={errors?.result}
          menuPlacement="bottom"
          menuPosition="absolute"
          getOptions={getActivityResultOptions}
          isLoading={isActivityResultsLoading || isGetActivityLoading}
          defaultOptions={
            defaultResult?.id
              ? [
                  {
                    label: defaultResult?.result,
                    value: defaultResult?.id?.toString(),
                    selected: true,
                  },
                ]
              : []
          }
          onChange={(e) => {
            const activityResultName = activityResult?.find(
              (item) => item?.id === Number(e)
            );
            if (setActivityResultName) {
              setActivityResultName(activityResultName?.result);
            }
          }}
        />
      </div>
      {/* {result === 'other' ? (
        <div className="px-[10px] w-full">
          <FormField<MarkAsDoneFormFields>
            type="textarea"
            name="other_result"
            label="Other Result"
            labelClass="if__label__blue"
            placeholder="Result"
            register={register}
            error={errors.other_result}
            required
          />
        </div>
      ) : (
        <></>
      )} */}

      <div className="px-[10px] w-full">
        <label className="if__label if__label__blue">
          Memo
          {is_memo_required ? <span className="required__sign">*</span> : ''}
        </label>
        <Controller
          name="memo"
          control={control}
          render={({ field: { onChange, value } }) => {
            if (textEditorRef.current && value) {
              textEditorRef.current.value = value;
            }
            return (
              <>
                <RichTextEditorComponent
                  ref={textEditorRef}
                  actionBegin={onbegin}
                  saveInterval={0}
                  id="inlineRTE"
                  autoSaveOnIdle
                  change={(e) => {
                    onChange(e.value ?? '');
                  }}
                  inlineMode={{ enable: true, onSelection: true }}
                  quickToolbarSettings={{ actionOnScroll: 'none' }}
                  toolbarSettings={{
                    items: [
                      'Bold',
                      'Italic',
                      'Underline',
                      'StrikeThrough',
                      'FontName',
                      'FontSize',
                      'FontColor',
                      'BackgroundColor',
                      '-',
                      'LowerCase',
                      'UpperCase',
                      'Formats',
                      'Alignments',
                      'NumberFormatList',
                      'BulletFormatList',
                      'Indent',
                      'Outdent',
                      '-',
                      'CreateLink',
                      'Image',
                      'ClearFormat',
                      'Print',
                      'SourceCode',
                      'FullScreen',
                      'Undo',
                      'Redo',
                    ],
                    enableFloating: true,
                  }}
                  format={{ width: 'auto' }}
                  insertImageSettings={{
                    saveFormat: 'Base64',
                  }}
                >
                  <Inject services={[HtmlEditor]} />
                </RichTextEditorComponent>
              </>
            );
          }}
        />
        {errors?.memo && <p className="ip__Error">{errors?.memo?.message}</p>}
      </div>
      <MentionComponent
        allowSpaces
        mentionChar="/"
        showMentionChar
        ref={snippetRef}
        id="mentionEditor"
        popupWidth="250px"
        popupHeight="200px"
        suggestionCount={100}
        fields={snippetFieldsData}
        change={handleSnippetChange}
        dataSource={snippetList.list}
        itemTemplate={snippetItemTemplate}
        displayTemplate={displaySnippetTemplate}
        target="#inlineRTErte-view"
      />
    </div>
  );
}

export default MarkAsDoneForm;
