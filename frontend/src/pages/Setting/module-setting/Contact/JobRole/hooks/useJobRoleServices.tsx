import { AsyncSelectGetOptions } from 'components/FormField/types/formField.types';
import { MODULE_PERMISSION } from 'constant/permissions.constant';
import { EntityAttributesEnum } from 'redux/api/entityAttributesApi';
import { useLazyGetJobRolesQuery } from 'redux/api/jobRoleApi';

type UseGetJobRoleOptionProps = {
  job_role: string;
};

export const useGetJobRoleOption = (props: UseGetJobRoleOptionProps) => {
  const { job_role } = props;

  // ** API **
  const [getJobRolesApi, { isLoading: isGetJobRoleLoading }] =
    useLazyGetJobRolesQuery();

  const getJobRoleOption: AsyncSelectGetOptions = async (option) => {
    const { data, error } = await getJobRolesApi(
      {
        data: {
          query: {
            page: option?.page,
            ...MODULE_PERMISSION.CONTACT.read,
            'q[type]': EntityAttributesEnum.JOB_ROLE,
          },
        },
      },
      true
    );
    if (!error && data?.rows) {
      let tempOption = data?.rows.map((val: { name: string; id: number }) => ({
        label: val.name || '',
        value: val.name || '',
      }));
      tempOption =
        job_role && tempOption[0]?.value !== job_role
          ? [
              {
                label: job_role,
                value: job_role,
              },
              ...tempOption,
            ]
          : [...tempOption];
      if (tempOption?.[0]?.label !== '') {
        return {
          option: tempOption,
          count: data?.count,
        };
      }
    }
  };

  return {
    getJobRoleOption,
    isGetJobRoleLoading,
  };
};
