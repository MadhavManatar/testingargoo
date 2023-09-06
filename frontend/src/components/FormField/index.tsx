// ** external packages **
import 'react-datepicker/dist/react-datepicker.css';

// ** components **
import { CreatableAsyncSelect } from './components/CreatableAsyncSelectFormField';
import CustomCreatableSelect from './components/CreatableSelectFormField';
import { CustomAsyncSelect } from './components/CustomAsyncSelectFormField';
import CustomSelect from './components/CustomSelectFormField';
import DateAndTimeFormField from './components/DateAndTimeFormField';
import DateFormField from './components/DateFormField';
import TimeFormField from './components/TimeFormField';
import TextAreaFormField from './components/TextAreaFormField';
import ColorPickerFormField from './components/ColorPickerFormField';
import MaskInputFormField from './components/MaskInputFormField';
import PassportFormField from './components/PassportFormField';
import CheckBoxFormField from './components/CheckBoxFormField';
import RadioFormField from './components/RadioFormField';
import DefaultFormField from './components/DefaultFormField';
import CurrencyFormatFormField from './components/CurrencyFormatFormField';
import ActivityTopicField from './components/ActivityTopicField';
import { CreatableAsyncSelectFormFieldForSearch } from './components/CreatableAsyncSelectFormFieldForSearch';

// ** types **
import {
  FieldType,
  FormFieldProps,
} from 'components/FormField/types/formField.types';
import RichTextEditorFormField from './components/RichTextEditorFormField';
import { CreatableAsyncSelectForEmail } from './components/CreatableAsyncSelectForEmailFormField';

const FormField = <TFormValues extends Record<string, unknown>>(
  fieldProps: FormFieldProps<TFormValues>
) => {
  const {
    type = 'text',
    getOptions = undefined,
    isLoading,
    wrapperClass,
    defaultSelectValue,
    getOnChange,
  } = fieldProps;

  const updatedFormField = {
    autoComplete: 'off',
    ...fieldProps,
  };

  const renderField = (field: FieldType) => {
    switch (field) {
      case 'date':
        return <DateFormField {...updatedFormField} />;
      case 'dateAndTime':
        return <DateAndTimeFormField {...updatedFormField} />;
      case 'time':
        return <TimeFormField {...updatedFormField} />;
      case 'select':
        return <CustomSelect {...updatedFormField} />;
      case 'asyncSelect':
        return (
          <CustomAsyncSelect
            {...updatedFormField}
            getOptions={getOptions}
            getOnChange={getOnChange}
            defaultSelectValue={defaultSelectValue}
            isLoading={isLoading}
          />
        );
      case 'creatableSelect':
        return <CustomCreatableSelect {...updatedFormField} />;
      case 'creatableAsyncSelect':
        return (
          <CreatableAsyncSelect
            {...updatedFormField}
            getOptions={getOptions}
            getOnChange={getOnChange}
            isLoading={isLoading}
          />
        );

      case 'creatableAsyncSelectForEmail':
        return (
          <CreatableAsyncSelectForEmail
            {...updatedFormField}
            getOptions={getOptions}
            getOnChange={getOnChange}
            isLoading={isLoading}
          />
        );

      case 'CreatableAsyncSelectFormFieldForSearch':
        return (
          <CreatableAsyncSelectFormFieldForSearch
            {...updatedFormField}
            getOnChange={getOnChange}
            getOptions={getOptions}
            isLoading={isLoading}
          />
        );
      case 'textarea':
        return <TextAreaFormField {...updatedFormField} />;
      case 'color':
        return <ColorPickerFormField {...updatedFormField} />;
      case 'richTextEditor':
        return <RichTextEditorFormField {...updatedFormField} />;
      case 'password':
        return <PassportFormField {...updatedFormField} />;
      case 'radio':
        return <RadioFormField {...updatedFormField} />;
      case 'checkbox':
        return <CheckBoxFormField {...updatedFormField} />;
      case 'mask_input':
        return <MaskInputFormField {...updatedFormField} />;
      case 'currency_format':
        return <CurrencyFormatFormField {...updatedFormField} />;
      case 'activity_topic':
        return <ActivityTopicField {...updatedFormField} />;
      default:
        return <DefaultFormField {...updatedFormField} />;
    }
  };

  return (
    <div className={`form__Group ${wrapperClass}`}>{renderField(type)}</div>
  );
};

export default FormField;
