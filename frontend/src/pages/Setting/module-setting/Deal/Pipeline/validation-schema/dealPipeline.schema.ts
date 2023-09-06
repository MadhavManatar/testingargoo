// ** import packages **
import _ from 'lodash';
import * as yup from 'yup';

// ** constant **
import { DealPipelineSchemaError } from 'constant/formErrorMessage.constant';

declare module 'yup' {
  interface ArraySchema<T> {
    uniqueProperty(a: string, message?: any): ArraySchema<T>;
  }
}

const { name: NameError, rot_days, stages } = DealPipelineSchemaError;

yup.addMethod(
  yup.array,
  'uniqueProperty',
  function uniqueProperty(propertyPath, message) {
    return this.test('unique', '', function unique(list) {
      const errors: any = [];
      list?.forEach((item, index) => {
        const propertyValue = _.get(item, propertyPath)?.toLowerCase()?.trim();
        const duplicate = list.filter(
          ({ name }) => name.toLowerCase().trim() === propertyValue
        );
        if (propertyValue && duplicate.length > 1) {
          errors?.push(
            this.createError({
              path: `${this.path}[${index}].${propertyPath}`,
              message,
            })
          );
        }
      });
      if (!_.isEmpty(errors)) {
        throw new yup.ValidationError(errors);
      }
      return true;
    });
  }
);

export const dealPipelineSchema = yup
  .object({
    name: yup.string().required(NameError).nullable(),
    stages: yup
      .array()
      .of(
        yup.object().shape({
          name: yup.string().required(stages.name),
          probability: yup
            .number()
            .typeError(stages.probability.valid)
            .required(stages.probability.required)
            .max(100, stages.probability.max)
            .nullable(),
          stage_type: yup.string().required(stages.stage_type).nullable(),
        })
      )
      .uniqueProperty('name', stages.nameUnique),
    rot_days: yup
      .number()
      .required()
      .integer(rot_days.integer)
      .max(1000, rot_days.max)
      .typeError(rot_days.valid)
      .nullable(),
    is_default: yup.boolean(),
  })
  .required();

export const dealPipelineStagesForDeleteSchema = yup.object({
  stage_id: yup.number().required(),
  pipeline_id: yup.number().required('Pipeline is required'),
  deal_stage_id: yup.number().required('Stage is required'),
});
