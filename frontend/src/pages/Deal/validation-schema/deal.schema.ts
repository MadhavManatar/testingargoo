// ** import packages **
import * as yup from 'yup';

// ** constant **
import { DealSchemaErrorMessage } from 'constant/formErrorMessage.constant';
// import { probabilityFloatRegex } from 'constant/regex.constant';

const {
  lead_owner_id,
  name,
  pipeline_id,
  stage,
  lead_status_id,
  contacts: ContactsError,
  // probability,
  reason,
  comment_memo,
} = DealSchemaErrorMessage;

export const dealSchema = yup.object({
  lead_owner_id: yup.string().required(lead_owner_id),
  name: yup.string().trim().required(name),
  pipeline_id: yup.string().required(pipeline_id).nullable(),
  deal_stage_id: yup.string().required(stage).nullable(),
  lead_status_id: yup.number().required(lead_status_id).nullable(),
  deal_value: yup.string().nullable(true),

  contacts: yup
    .array()
    .of(
      yup.object().shape(
        {
          job_role: yup
            .string()
            .test('job_role', ContactsError.job_role, (v, value: any) => {
              const {
                contacts,
              }: {
                contacts: {
                  is_primary: boolean;
                  value: string | number;
                  job_role: string;
                }[];
              } = value.options.from[1].value;
              if (
                (value?.parent?.contact_id ||
                  ((contacts.length || 0) > 1 && value?.parent?.is_primary)) &&
                !value?.parent?.job_role
              ) {
                return false;
              }
              return true;
            }),
          contact_id: yup
            .string()
            .test('value', ContactsError.contact, (v, value: any) => {
              const {
                contacts,
              }: {
                contacts: {
                  is_primary: boolean;
                  value: string | number;
                  job_role: string;
                }[];
              } = value.options.from[1].value;

              if (
                (value?.parent?.job_role ||
                  ((contacts.length || 0) > 1 && value?.parent?.is_primary)) &&
                !value?.parent?.contact_id
              ) {
                return false;
              }
              return true;
            })
            .nullable(),
        },
        [['contact_id', 'job_role']]
      )
    )
    .nullable(),
});

export const dealLostSchema = yup
  .object({
    reason: yup.string().required(reason),
    comment: yup.string(),
  })
  .required();

export const dealWonLostSchema = yup
  .object({
    stage_id: yup.string().required(stage),
  })
  .required();

export const dealLostWithMemoSchema = yup
  .object({
    reason: yup.string().required(reason),
    comment: yup.string().required(comment_memo),
  })
  .required();
