import { LeadSchemaErrorMessage } from 'constant/formErrorMessage.constant';
import * as yup from 'yup';

export const leadSchema = yup
  .object({
    lead_owner_id: yup
      .string().trim()
      .required(LeadSchemaErrorMessage.owner)
      .nullable(),
    lead_temp_id: yup
      .number()
      .required(LeadSchemaErrorMessage.temperature)
      .nullable(),
    lead_status_id: yup
      .number()
      .required(LeadSchemaErrorMessage.status)
      .nullable(),
    name: yup.string().required(LeadSchemaErrorMessage.name).nullable(),
    deal_value: yup.string().nullable(true),
    contacts: yup
      .array()
      .of(
        yup.object().shape(
          {
            job_role: yup
              .string()
              .test(
                'job_role',
                LeadSchemaErrorMessage.contacts.job_role,
                (v, value: any) => {
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
                      ((contacts.length || 0) > 1 &&
                        value?.parent?.is_primary)) &&
                    !value?.parent?.job_role
                  ) {
                    return false;
                  }
                  return true;
                }
              ),
            contact_id: yup
              .string()
              .test(
                'value',
                LeadSchemaErrorMessage.contacts.contact,
                (v, value: any) => {
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
                      ((contacts.length || 0) > 1 &&
                        value?.parent?.is_primary)) &&
                    !value?.parent?.contact_id
                  ) {
                    return false;
                  }
                  return true;
                }
              )
              .nullable(),
          },
          [['contact_id', 'job_role']]
        )
      )
      .nullable(),
  })
  .required();
