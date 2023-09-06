// ** Import Packages **
import {
  NodeSelection,
  RichTextEditorComponent,
} from '@syncfusion/ej2-react-richtexteditor';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

// ** Redux **
import { getCurrentUser } from 'redux/slices/authSlice';

// ** Components **
import Dropdown from 'components/Dropdown';
import Icon from 'components/Icon';


// ** Constants **
import { GENERAL_SETTING_VALID_KEYS } from 'constant';
import { POLYMORPHIC_MODELS } from 'constant/permissions.constant';

// ** Util **
import { convertAtoB, convertStringToBoolean } from 'utils/util';
import { useLazyGetGeneralSettingQuery } from 'redux/api/generalSettingApi';
import { useLazyGetUserByIdQuery } from 'redux/api/userApi';

type Props = {
  editorRef: React.RefObject<RichTextEditorComponent>;
};

const InsertSignature = (props: Props) => {
  const { editorRef } = props;

  // ** Store **
  const currentUser = useSelector(getCurrentUser);

  let range: Range | null;
  const selection: NodeSelection = new NodeSelection();
  const [saveSelection, setSaveSelection] = useState<NodeSelection | null>();
  const [userSignature, setUserSignature] = useState(null);


  // ** APIS **
  const [getGeneralSetting] = useLazyGetGeneralSettingQuery();
  const [getUserByIdAPI] = useLazyGetUserByIdQuery();

  const insertField = (value?: string) => {
    saveSelection?.restore();
    editorRef.current?.executeCommand(
      'insertHTML',
      `<br><br clear="all"><div><br></div><br><div dir="ltr" class="gmail_signature" data-smartmail="gmail_signature">${convertAtoB(
        value || userSignature
      )}</div>`
    );
    editorRef.current?.formatter.saveData?.();
  };

  const setCursor = () => {
    (editorRef.current?.contentModule.getEditPanel?.() as HTMLElement).focus();
    range = selection.getRange(document);
    setSaveSelection(selection.save(range, document));
  };

  const id = Number(currentUser?.id);
  const getUserDetail = async () => {
    if (currentUser?.id) {
      const data = await getUserByIdAPI({
        id,
        params: {
          select: 'user_signature',
        },
      }, true);
      if (!("error" in data) && data.data.user_signature) {
        setUserSignature(data?.data.user_signature);
        checkAutoLoadSignatureIsActive(data?.data.user_signature);
      }
    }
  };

  const checkAutoLoadSignatureIsActive = async (signature: string) => {
    const { data, error } = await getGeneralSetting(
      {
        params: {
          'q[key]': GENERAL_SETTING_VALID_KEYS.is_signature_auto_load,
          'q[model_name]': POLYMORPHIC_MODELS.USER,
          'q[model_record_id]': currentUser?.id,
          module: 'user_settings',
        },
      },
      true
    );

    if (data && !error) {
      if (convertStringToBoolean(data?.[0]?.value)) {
        insertField(signature);
      }
    }
  };

  useEffect(() => {
    getUserDetail();
  }, []);

  return (
    <>
      <div onClick={() => setCursor()}>
        <Dropdown
          className="tippy__dropdown__signature"
          placement="top-end"
          content={({ close }) => (
            <ul className="tippy__dropdown__ul">
              <li className="item">
                <div onClick={close} className="item__link">
                  {userSignature ? (
                    <div
                      className="flex items-center"
                      onClick={() => insertField()}
                    >
                      <Icon className="p-[6px]" iconType="plusFilledBlueIcon" />
                      <span className="item__text whitespace-pre pl-[3px]">
                        Add Signature
                      </span>
                    </div>
                  ) : (
                    <div className="item__text">No Signature</div>
                  )}
                </div>
              </li>
            </ul>
          )}
        >
          <button className="action__btn" onClick={() => getUserDetail()}>
            <Icon iconType="composeMailEditFilledIcon" />
          </button>
        </Dropdown>
      </div>
    </>
  );
};
export default InsertSignature;
