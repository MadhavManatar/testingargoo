// ** Import Packages **
import {
  NodeSelection,
  RichTextEditorComponent,
} from '@syncfusion/ej2-react-richtexteditor';
import _ from 'lodash';
import { useEffect, useState } from 'react';

// ** Components **
import Dropdown from 'components/Dropdown';
import Icon from 'components/Icon';

// ** Constants **
import {
  Tab,
  TaBObj,
  TABS,
  TAB_CONTENT_OBJ,
} from 'constant/emailTemplate.constant';

// ** Util **
import { getIconClass } from 'pages/Email/helper/emailTemplate';
import { useSelector } from 'react-redux';
import {
  DataEmailInsert,
  getEmailInsertField,
} from 'redux/slices/emailInsertField';
import { format } from 'date-fns-tz';
import { formatPhoneNumber } from 'utils/util';

type Props = {
  editorRef: React.RefObject<RichTextEditorComponent>;
  isDisabledField?: boolean;
  setRunSetFieldValueScript?: React.Dispatch<React.SetStateAction<number>>;
};

const InsertField = (props: Props) => {
  const {
    editorRef,
    isDisabledField = true,
    setRunSetFieldValueScript,
  } = props;

  const [currentTab, setCurrentTab] = useState<Tab>(Tab.ACCOUNT);
  const emailInsertField = useSelector(getEmailInsertField);

  let range: Range | null;
  const selection: NodeSelection = new NodeSelection();
  const [saveSelection, setSaveSelection] = useState<NodeSelection | null>();
  const [listData, setListData] = useState<TaBObj[]>([]);

  useEffect(() => {
    setListData(TAB_CONTENT_OBJ[currentTab]);
  }, [currentTab]);

  const insertField = (obj: TaBObj) => {
    saveSelection?.restore();
    let defaultValue =
      emailInsertField[currentTab]?.[obj.id as keyof DataEmailInsert] || '';

    if (obj.id === 'closing_date' && defaultValue) {
      defaultValue = format(new Date(defaultValue), 'MM/dd/yyyy') || '';
    }
    if (obj.id === 'contact_phone' && defaultValue) {
      defaultValue = formatPhoneNumber(defaultValue as string) || '';
    }

    editorRef.current?.executeCommand(
      'insertHTML',
      `<input class="templateInput__field ${getIconClass(currentTab)}" ${
        isDisabledField ? 'disabled' : ''
      } id="${obj.id}" placeholder="${obj.placeholder}">&nbsp;</input>`
    );

    const editorFormFields = document.getElementById(
      obj.id
    ) as HTMLInputElement;
    if (editorFormFields && defaultValue) {
      editorFormFields.value = defaultValue as string;
    }
    editorRef.current?.formatter.saveData?.();
    setRunSetFieldValueScript?.(Math.random());
  };

  const setCursor = () => {
    (editorRef.current?.contentModule.getEditPanel?.() as HTMLElement).focus();
    range = selection.getRange(document);
    setSaveSelection(selection.save(range, document));
  };

  const searchItems = (value: string) => {
    const searchData = TAB_CONTENT_OBJ[currentTab].filter((obj) => {
      return JSON.stringify(obj)
        .toLocaleLowerCase()
        .includes(value.trim().toString());
    });
    if (_.isArray(searchData)) {
      setListData(searchData);
    }
  };

  return (
    <>
      <div onClick={() => setCursor()}>
        <Dropdown
          className="compose__mail__select__tippy"
          zIndex={10}
          content={({ close }) => (
            <div onClick={() => setCursor()}>
              <div className="ip__form__hasIcon">
                <input
                  onChange={(e) => searchItems(e.target.value.toLowerCase())}
                  onClick={(e) => e.stopPropagation()}
                  className="ip__input"
                  placeholder="Search or Enter"
                />
                <Icon
                  iconType="searchStrokeIcon"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div
                className="flex types__icon mt-[15px]"
                onClick={(e) => e.stopPropagation()}
              >
                {TABS.map((tab, key) => (
                  <Icon
                    onClick={() => {
                      saveSelection?.restore();
                      editorRef.current?.formatter.saveData?.();
                      setCurrentTab(tab.id);
                    }}
                    className={`highlighted cursor-pointer duration-500 !w-[32px] !h-[32px] !bg-[#1776ba1a] mr-[10px] mb-[8px] !rounded-[8px] !p-[6px] ${
                      currentTab === tab.id ? 'active' : ''
                    }`}
                    key={key}
                    iconType={tab.icon}
                  />
                ))}
              </div>
              <div className="tippy__dropdown__ul min-w-0 py-0">
                {listData.map((obj, key) => (
                  <div
                    className="item flex flex-wrap items-center !px-0 border-b border-b-black/[0.06] before:hidden"
                    key={key}
                    onClick={() => {
                      insertField(obj);
                      close();
                    }}
                  >
                    <span className="text text-[14px] text-ipBlack__textColor font-biotif__Medium whitespace-pre block w-[calc(100%_-_55px)] pl-[3px] pr-[7px]">
                      {obj.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        >
          <button
            className="compose__mail__select__dBtn mr-[10px] mb-[6px]"
            type="button"
          >
            Insert Field
          </button>
        </Dropdown>
      </div>
    </>
  );
};
export default InsertField;
