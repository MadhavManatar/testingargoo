// ** Import Packages **
import { useEffect, useRef, useState } from 'react';

// ** Components **
import FormField from 'components/FormField';

// ** Hook **
import { useGetCategoryOptions } from '../../SnippetCategory/hook/useCategoryOptions';

// ** Types **
import {
  AddSnippetFieldType,
  SnippetFormProps,
} from '../types/snippetText.types';

// ** Constant **
import { ACCESSIBILITY, SNIPPET_DEFAULT_TYPE } from 'constant';

// ** Helper **
import { focusOnError } from 'helper';
import { OPTION_LISTING_DATA_LIMIT } from 'constant/dataLimit.constant';

const SnippetForm = (props: SnippetFormProps) => {
  const {
    errors,
    register,
    control,
    setValue,
    displayFieldProps,
    snippetInfo,
  } = props;

  const [defaultGeneralCategory, setDefaultGeneralCategory] = useState<any>();
  const { getSnippetCategoriesOptions, isLoading } = useGetCategoryOptions();
  const errorDivRef = useRef<Record<string, HTMLDivElement | null>>({});
  useEffect(() => {
    focusOnError(errorDivRef, errors);
  }, [errors]);

  useEffect(() => {
    if (!snippetInfo?.snippet_category.id) {
      getDefaultCategory();
    }
    if (snippetInfo?.snippet) {
      setValue('snippet_text', snippetInfo.snippet);
    }
  }, []);

  useEffect(() => {
    if (defaultGeneralCategory?.id) {
      setValue('category', defaultGeneralCategory?.id);
    }
  }, [defaultGeneralCategory]);

  const getDefaultCategory = async () => {
    const res = await getSnippetCategoriesOptions();
    if (res?.extraInfo?.length) {
      const defaultCategory = res.extraInfo?.find(
        (category) => category?.is_system
      );
      setDefaultGeneralCategory(defaultCategory);
    }
  };

  return (
    <>
      <FormField<AddSnippetFieldType>
        required
        type="text"
        label="Title"
        name="title"
        fieldLimit={25}
        control={control}
        register={register}
        error={errors?.title}
        labelClass="if__label__blue"
        placeholder="Enter Snippet Title"
      />
      <div className="relative z-[4]">
        <FormField<AddSnippetFieldType>
          id="type"
          required
          placeholder="Select Type"
          type="select"
          name="type"
          label="Type"
          labelClass="if__label__blue"
          serveSideSearch
          register={register}
          control={control}
          error={errors?.type}
          options={SNIPPET_DEFAULT_TYPE}
          menuPlacement="bottom"
          menuPosition="fixed"
        />
        <FormField<AddSnippetFieldType>
          id="accessibility"
          required
          placeholder="Select Type"
          type="select"
          name="accessibility"
          label="Accessibility"
          labelClass="if__label__blue"
          serveSideSearch
          register={register}
          control={control}
          error={errors?.accessibility}
          options={ACCESSIBILITY}
          menuPlacement="bottom"
          menuPosition="fixed"
        />
        <FormField<AddSnippetFieldType>
          id="category"
          key={defaultGeneralCategory}
          placeholder="Select Category"
          type="CreatableAsyncSelectFormFieldForSearch"
          name="category"
          required
          label="Category"
          labelClass="if__label__blue"
          inputMaxLength={50}
          icon="buildingFilledIcon"
          menuPosition="absolute"
          menuPlacement="auto"
          iconPosition="left"
          aria-placeholder="Select Category"
          control={control}
          serveSideSearch
          getOptions={getSnippetCategoriesOptions}
          isLoading={isLoading}
          defaultOptions={
            snippetInfo?.snippet_category
              ? [
                  {
                    label: snippetInfo?.snippet_category?.name,
                    value: snippetInfo?.snippet_category?.id,
                    selected: true,
                  },
                ]
              : defaultGeneralCategory?.id
              ? [
                  {
                    label: defaultGeneralCategory?.name,
                    value: defaultGeneralCategory?.id,
                    selected: true,
                  },
                ]
              : []
          }
          error={errors?.category}
          isClearable
          {...(displayFieldProps &&
            displayFieldProps.category && {
              ...displayFieldProps.category,
            })}
          limit={OPTION_LISTING_DATA_LIMIT}
        />
      </div>
      <FormField<AddSnippetFieldType>
        id="snippet_text"
        labelClass="if__label__blue"
        required
        type="richTextEditor"
        name="snippet_text"
        placeholder="Create Snippet"
        label="Snippet Text"
        setValue={(valueObj) => setValue('snippet_text', valueObj || '')}
        register={register}
        control={control}
        {...(displayFieldProps &&
          displayFieldProps.snippet_text && {
            ...displayFieldProps.snippet_text,
          })}
      />
      <div ref={(element) => (errorDivRef.current.snippet_text = element)}>
        {errors?.snippet_text && (
          <p className="ip__Error">{errors?.snippet_text.message}</p>
        )}
      </div>
    </>
  );
};

export default SnippetForm;
