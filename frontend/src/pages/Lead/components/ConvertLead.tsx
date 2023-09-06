// ** Import Packages **
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';

// ** Types **
import { ConvertLeadFormFieldType } from '../types/convertLead.type';

// ** Services **

// ** Schema **
import { dealSchema } from 'pages/Deal/validation-schema/deal.schema';

// ** Constant **
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';

// ** Others **
import generateDealFormData from 'pages/Deal/helper/deal.helper';
import { FormProvider, useForm } from 'react-hook-form';
import { useGetLeadDetails } from '../hooks/useLeadService';
import AddDealLostModal from '../../Deal/components/detail/AddDealLostModal';
import { convertNumberOrNull, setUrlParams } from 'utils/util';
import Breadcrumbs from 'components/Breadcrumbs';
import { BREAD_CRUMB } from 'constant';
import EditDealSkeleton from 'pages/Deal/skeletons/EditDealSkeleton';
import RouteChangeConformationModal from 'components/Modal/RouteChangeConformationModal';
import ConvertLeadForm from './ConvertLeadForm';
import Button from 'components/Button';
import { useUpdateLeadMutation } from 'redux/api/leadApi';

const ConvertLead = () => {
  // ** Hooks **
  const navigate = useNavigate();
  const { id } = useParams();
  const leadId = convertNumberOrNull(id);
  // ** Custom Hooks **

  const formMethods = useForm<ConvertLeadFormFieldType>({
    resolver: yupResolver(dealSchema),
  });

  const {
    handleSubmit,
    formState: { dirtyFields },
  } = formMethods;

  const [updateLeadByIdAPI, { isLoading: isConvertLeadLoading }] =
    useUpdateLeadMutation();

  const { leadData, isLoading: isGetLeadLoading } = useGetLeadDetails({
    leadId,
  });

  // ** State **/
  const [customIsDirty, setCustomIsDirty] = useState<boolean>(true);
  const [stageLostIds, setStageLostIds] = useState<number[]>([]);
  const [openDealLostModal, setOpenDealLostModal] = useState<{
    isOpen: boolean;
    formData: ConvertLeadFormFieldType;
  }>({
    isOpen: false,
    formData: {},
  });

  const convertLead = async (formVal: ConvertLeadFormFieldType) => {
    setCustomIsDirty(false);
    const { deal_value, probability } = formVal;
    const updatedDealValue = deal_value?.match(/(\d+)(\.\d+)?/g)?.join('');
    const updatedProbability = probability?.match(/(\d+)(\.\d+)?/g)?.join('');

    const LeadFormData = generateDealFormData(
      {
        ...formVal,
        deal_value: updatedDealValue || '',
        probability: updatedProbability,
      },
      'edit',
      leadData.lead.related_contacts
    );
    LeadFormData.append('is_converted', 'true');

    const data = await updateLeadByIdAPI({
      id: leadId || 0,
      data: LeadFormData,
    });

    if ('data' in data && !('error' in data)) {
      navigate(setUrlParams(PRIVATE_NAVIGATION.deals.detailPage, leadId || 0));
    }
  };

  const onSubmit = handleSubmit(async (value) => {
    if (stageLostIds.includes(Number(value.deal_stage_id || 0))) {
      setOpenDealLostModal({
        formData: value,
        isOpen: true,
      });
    } else {
      convertLead(value);
    }
  });

  const closeDealLostModal = () => {
    setOpenDealLostModal({
      ...openDealLostModal,
      isOpen: false,
    });
  };

  const onCancelForm = () => {
    navigate(-1);
  };

  return (
    <>
      <>
        <Breadcrumbs path={BREAD_CRUMB.convertLead} />
        <div>
          {isGetLeadLoading ? (
            <EditDealSkeleton />
          ) : (
            <div className="ipTabsWrapper">
              <div className="ipTabs">
                <div className="ipTabsContantWrapper">
                  <div className="fixed__wrapper__dealEdit">
                    <FormProvider {...formMethods}>
                      <form onSubmit={onSubmit}>
                        <ConvertLeadForm
                          setStageLostIds={setStageLostIds}
                          editFormFlag
                          isGetLeadLoading={isGetLeadLoading}
                          leadData={leadData}
                        />
                        <div className="action__fixed__btn__dealEdit flex flex-wrap">
                          <Button
                            className="cancel__btn secondary__Btn mr-[7px] min-w-[120px] sm:min-w-[calc(50%_-_7px)]"
                            onClick={() => onCancelForm()}
                          >
                            Cancel
                          </Button>
                          <Button
                            className="save__btn primary__Btn min-w-[120px] py-[11px] ml-[7px] sm:min-w-[calc(50%_-_7px)]"
                            type="submit"
                            isLoading={isConvertLeadLoading}
                          >
                            Update
                          </Button>
                        </div>
                      </form>
                    </FormProvider>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </>

      <RouteChangeConformationModal
        isDirtyCondition={
          Object.values(dirtyFields)?.length > 0 && customIsDirty
        }
      />
      {openDealLostModal.isOpen && (
        <AddDealLostModal
          isOpen={openDealLostModal.isOpen}
          closeModal={closeDealLostModal}
          formData={openDealLostModal?.formData}
          stageId={openDealLostModal?.formData.deal_stage_id}
          leadData={leadData}
          id={leadId}
        />
      )}
    </>
  );
};

export default ConvertLead;
