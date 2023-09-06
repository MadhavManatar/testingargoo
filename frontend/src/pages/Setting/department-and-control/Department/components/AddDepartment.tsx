// ** Import Packages **
import { useState } from 'react';
import { useParams } from 'react-router-dom';

// ** Components **
import Breadcrumbs from 'components/Breadcrumbs';
import AddDepartmentForm from './AddDepartmentForm';
import AddMemberModal from './AddMemberModal';
import MemberListing from './MemberListing';

// ** Constant **
import { BREAD_CRUMB } from 'constant';

// ** Types **
import { User } from '../../../user-setting/User/types/user.types';

// ** Other **
import { convertNumberOrNull } from 'utils/util';

const AddDepartment = () => {
  // ** Hooks **
  const { id } = useParams();
  const departmentId = convertNumberOrNull(id);

  // ** States **
  const [selectedMembers, setSelectedMembers] = useState<User[]>([]);
  const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dirty, setDirty] = useState(false);

  const closeAddMemberModal = () => {
    setAddMemberModalOpen(false);
  };

  return (
    <div>
      {departmentId ? (
        <Breadcrumbs path={BREAD_CRUMB.updateDepartment} />
      ) : (
        <Breadcrumbs path={BREAD_CRUMB.createDepartment} />
      )}
      <div className="fixed__wrapper__department">
        <div className="flex flex-wrap items-start">
          <div className="department__left w-[520px] 4xl:w-[320px] xl:w-full">
            <AddDepartmentForm
              setLoading={setLoading}
              departmentId={departmentId}
              selectedMembers={selectedMembers}
              setSelectedMembers={setSelectedMembers}
              setAddMemberModalOpen={setAddMemberModalOpen}
              dirty={dirty}
            />
          </div>
          <MemberListing
            loading={loading}
            selectedMembers={selectedMembers}
            setDirty={setDirty}
            setSelectedMembers={setSelectedMembers}
          />
        </div>
      </div>
      {addMemberModalOpen && (
        <AddMemberModal
          isOpen={addMemberModalOpen}
          close={closeAddMemberModal}
          selectedMembers={selectedMembers}
          setSelectedMembers={setSelectedMembers}
          setDirty={setDirty}
        />
      )}
    </div>
  );
};

export default AddDepartment;
