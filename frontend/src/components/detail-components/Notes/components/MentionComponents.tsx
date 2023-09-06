// ** Import Packages **
import { MentionComponent } from '@syncfusion/ej2-react-dropdowns';
import {
  HtmlEditor,
  Inject,
  NodeSelection,
  RichTextEditorComponent,
} from '@syncfusion/ej2-react-richtexteditor';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

// ** Redux **
import { useLazyGetSnippetSettingQuery } from 'redux/api/snippetSettingApi';
import { UserInterface, getCurrentUser } from 'redux/slices/authSlice';

// ** Components **
import Image from 'components/Image';

// ** Service **
import { useGetReportsUser } from 'pages/Setting/user-setting/User/hooks/useUserService';

// ** Type **
import { SnippetModalType } from 'pages/Setting/general-setting/common-controls/Snippet/types/snippet.types';

// ** Util **
import { convertAtoB } from 'utils/util';

type PropsType = {
  onChange: (...event: any[]) => void;
  setUserIds: any;
  noteData: any;
  setUrl?: React.Dispatch<React.SetStateAction<string | undefined>>;
};

const MentionIntegration = (props: PropsType) => {
  const { onChange, setUserIds, noteData, setUrl } = props;

  const { userOrDescendantUserOptions } = useGetReportsUser();
  const currentUser = useSelector(getCurrentUser);

  const fieldsData: { [key: string]: string } = { text: 'Name' };
  const snippetFieldsData: { [key: string]: string } = { text: 'title' };

  const mentionRef = useRef<MentionComponent>(null);
  const snippetRef = useRef<MentionComponent>(null);
  const textEditorRef = useRef<RichTextEditorComponent>(null);

  const [snippetList, setSnippetList] = useState<SnippetModalType>({});
  const [userHireKeyData, setUserHireKeyData] = useState<any>();

  const [getSnippetsAPI] = useLazyGetSnippetSettingQuery();

  const userMentionData = userHireKeyData?.map(
    (selectedUser: {
      email: string;
      last_name: string;
      first_name: string;
      profile_image: string;
      id: { toString: () => string };
      full_name: string;
    }) => ({
      id: selectedUser.id.toString(),
      Name: `${selectedUser.full_name}`,
      profile_image: selectedUser.profile_image,
      EmailId: selectedUser.email,
      first_name: selectedUser.first_name,
      last_name: selectedUser.last_name,
    })
  );

  useEffect(() => {
    getSnippetList();
    handelReportToData();
  }, []);

  const actionBeginsHandler = (args: any): void => {
    if (args.requestType === 'EnterAction') {
      args.cancel = true;
    }
  };

  const getSnippetList = async () => {
    const { data, error } = await getSnippetsAPI(
      {
        data: {
          query: {
            limit: 100,
            'q[type][in]': ['note', 'anywhere'],
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

  const handelReportToData = async () => {
    textEditorRef.current?.focusIn();
    const res = (await userOrDescendantUserOptions(
      currentUser as UserInterface,false
    )) as any;
    setUserHireKeyData(res.returnData.rows);
  };

  const itemTemplate = (data: any): JSX.Element => {
    return (
      <div className="mention__li">
        <div className="img__wrapper">
          <div className="inner__wrapper" id="mention-TemplateList">
            <Image
              imgPath={data?.profile_image}
              first_name={data?.first_name}
              last_name={data?.last_name}
              imgClassName="w-full h-full object-cover object-center rounded-full"
              serverPath
            />
          </div>
        </div>
        <div className="mentionNameList details__wrapper">
          <div className="person">{data.Name}</div>
          {/* comment this code */}
          {/* <div className="email">{data.EmailId}</div> */}
        </div>
      </div>
    );
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

  const displayTemplate = (data: any): JSX.Element => {
    return (
      <>
        <a title={data.email}>@{data.Name}</a>
      </>
    );
  };

  const displaySnippetTemplate = (data: any) => {
    return (
      // eslint-disable-next-line react/no-danger
      <div dangerouslySetInnerHTML={{ __html: convertAtoB(data?.snippet) }} />
    );
  };

  const handleMentionChange = () => {
    const selectedData = [] as unknown as [number | undefined];
    const chip = (mentionRef.current as any).inputElement.querySelectorAll(
      '.e-mention-chip'
    );
    for (let i = 0; i <= chip.length - 1; i++) {
      const data1 = chip[i].innerText;
      const updatedString = data1.replace('@', '');
      const selectedUserID = userHireKeyData
        .filter((val: { full_name: string }) => val.full_name === updatedString)
        .map((val: any) => val.id)
        .toString();
      selectedData.push(selectedUserID);
    }

    setUserIds(selectedData);
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

  const handelChange = (e: any) => {
    if (setUrl && e.value) {
      const urlValidator = /https?:\/\/[^"\s]+/g;
      const firstUrl = e?.value?.match(urlValidator);
      setUrl(firstUrl?.[0]);
    }
    onChange(e.value);
  };

  return (
    <div className="control-pane">
      <div className="control-section" id="rte">
        <div className="rte-control-section">
          <RichTextEditorComponent
            ref={textEditorRef}
            id="mention_integration"
            value={noteData ? noteData?.description || noteData : ''}
            change={(e) => handelChange(e)}
            placeholder="Type @ and tag the name and hit / to add snippet"
            actionBegin={actionBeginsHandler}
          >
            <Inject services={[HtmlEditor]} />
          </RichTextEditorComponent>
        </div>
      </div>
      <MentionComponent
        id="mentionEditor"
        target="#mention_integration_rte-edit-view"
        suggestionCount={8}
        showMentionChar={false}
        allowSpaces
        change={handleMentionChange}
        ref={mentionRef}
        dataSource={userMentionData}
        fields={fieldsData}
        popupWidth="250px"
        popupHeight="200px"
        itemTemplate={itemTemplate}
        displayTemplate={displayTemplate}
      />

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
        target="#mention_integration_rte-edit-view"
      />
    </div>
  );
};
export default MentionIntegration;
