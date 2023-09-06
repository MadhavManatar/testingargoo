// ** Components **
import AlertModal from 'components/Modal/AlertModal';

// ** Constant **
import { ModuleNames } from 'constant/permissions.constant';

// ** Type **
import { DuplicateFieldWarningModalPropsType } from './types/index.types';

const DuplicateFieldWarningModal = (
  props: DuplicateFieldWarningModalPropsType
) => {
  const { isOpen, data, closeModal } = props;
  const fieldName = data?.field === 'relatedContact' ? 'name' : data?.field;
  return (
    <AlertModal
      visible={isOpen}
      onClose={closeModal}
      cancelButtonText="OK"
      onCancel={closeModal}
      width="800px"
    >
      <h6 className="confirmation__title !w-full !text-[16px] mb-[10px]">
        <span className="text-ip__Red">{data?.value}</span> {fieldName} is
        already associated with {!data?.recordName ? 'another' : ' '}{' '}
        {data?.moduleName === ModuleNames.CONTACT ? 'contact' : 'account'}
        {!data?.recordName ? '. ' : ' '}
        {data?.recordName && (
          <>
            <span className="text-primaryColor">{data?.recordName}</span>.{' '}
          </>
        )}
        Please enter a different {fieldName}.
      </h6>
    </AlertModal>
  );
};

export default DuplicateFieldWarningModal;
