/* eslint-disable no-underscore-dangle */

// ** components **
import FormField from 'components/FormField';

// ** types **
import { AssignTagFormValueType, TagFormProps } from './types/assignTags.type';

// ** services **
import { useGetTagsOptions } from 'pages/Setting/general-setting/common-controls/Tag/hooks/useTagService';
import { useState } from 'react';
import { MultiValue, SingleValue } from 'react-select';
import { Option } from 'components/FormField/types/formField.types';
import { tagResponse } from 'pages/Setting/general-setting/common-controls/Tag/types/tag.type';
// import _ from 'lodash';

const AssignTagForm = (props: TagFormProps) => {
  const {
    errors,
    control,
    setAssignedTags,
    setDisableSaveBtn,
    assignedTags,
    reset,
    setError,
    alreadyAssignID,
    setAlreadyAssignID,
  } = props;

  // ** Custom hooks **
  const { getTagsOptions, isLoading } = useGetTagsOptions(alreadyAssignID);

  // State
  const [refreshTags, setRefreshTags] = useState<boolean>(false);

  const resetForm = () => {
    setTimeout(() => {
      reset({ tags: [] });
      setRefreshTags((prev) => !prev);
    }, 0);
  };

  // AutoSave Tag Once User Select Tag From Dropdown
  const autoSaveTagsInState = (
    formVal: MultiValue<Option> | SingleValue<Option>
  ) => {
    if (
      formVal &&
      assignedTags?.list?.find(
        (val) => val.tag.name === (formVal as MultiValue<Option>)[0].label
      )
    ) {
      resetForm();
      return;
    }
    if (formVal) {
      setError('tags', {});
      if (setDisableSaveBtn) setDisableSaveBtn(false);
      formVal.forEach(
        (tag: {
          color: string;
          label: string;
          value: number;
          __isNew__: boolean;
        }) => {
          let newData: tagResponse;
          if (tag.__isNew__) {
            newData = {
              id: assignedTags.total ? assignedTags.total + 1 : 1,
              create: true,
              tag: {
                id: 0,
                name: tag.label.trim(),
                color: tag.color,
              },
            };
          } else {
            setAlreadyAssignID([...alreadyAssignID, tag.value]);
            newData = {
              id: assignedTags.total ? assignedTags.total + 1 : 1,
              tag: {
                id: tag.value,
                name: tag.label.trim(),
                color: tag.color,
              },
            };
          }
          if (setAssignedTags)
            setAssignedTags((prev) => {
              const oldTotal = prev.total ? prev.total : 0;
              return {
                list: [...prev.list, newData],
                total: oldTotal + 1,
              };
            });
        }
      );

      resetForm();
    }
  };

  return (
    <FormField<AssignTagFormValueType>
      key={`${refreshTags}`}
      id="tag"
      placeholder="Search Or Enter"
      type="creatableAsyncSelect"
      isMulti
      name="tags"
      serveSideSearch
      icon="searchStrokeIcon"
      control={control}
      error={errors.tags}
      inputMaxLength={50}
      getOptions={getTagsOptions}
      isLoading={isLoading}
      menuPosition="fixed"
      isMultiColor
      getOnChange={(formVal) => {
        autoSaveTagsInState(formVal);
      }}
    />
  );
};

export default AssignTagForm;
