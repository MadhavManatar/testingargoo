import Button from 'components/Button'
import FormField from 'components/FormField'
import { LOGIN_STEP } from 'constant'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { setAuthenticated, setOrganizationUUID, } from 'redux/slices/authSlice'
import { checkInputIsNumber } from 'utils/util'
import AuthCard from '../components/AuthCard'
import { OrganizationOptions, TwoFactorTypes } from '../Login/types/login.types'
import { use2FACodeVerifyAPI } from '../services/auth.service'

interface Props {
    setCurrentStep: React.Dispatch<React.SetStateAction<string>>;
    isVerified: () => Promise<void>, organizationList: OrganizationOptions[];
    twoFactorData: TwoFactorTypes | undefined
}

const TowFactorVerify = ({ setCurrentStep, isVerified, organizationList, twoFactorData }: Props) => {
    // ** hooks ** 
    const dispatch = useDispatch()

    // ** custom hooks ** 
    const { verify2FACodeAPI } = use2FACodeVerifyAPI()

    const formMethods = useForm<{ code: string }>({ defaultValues: { code: '' } });
    const { setValue, setError, clearErrors, handleSubmit, formState: { errors }, control, register, watch } = formMethods;

    const onSubmit = handleSubmit(async (formVal: { code: string }) => {
        const formData = {
            ...formVal,
            secret: twoFactorData?.secret
        }
        const { data: verify, error: verifyError } = await verify2FACodeAPI(formData)
        if (!verifyError && verify.verified) {
            const organizationUUID = localStorage.getItem('organization_uuid');
            if (!organizationUUID && organizationList && organizationList?.length > 1) {
                setCurrentStep(LOGIN_STEP.ORGANIZATION_FORM)
            } else {
                dispatch(setAuthenticated({ isAuthenticated: true }));
                if (organizationUUID) dispatch(setOrganizationUUID(organizationUUID));
                isVerified()
            }
        } else {
            setError('code', { message: "Verification Code doesn't match...!" })
        }
    })

    return (
        <AuthCard showHeader={false}>
            <h3 className='text-[26px] font-biotif__Medium text-center text-black mb-[10px]'>Two Factor Authentication</h3>
            <form onSubmit={onSubmit}>
                {twoFactorData?.QRCode &&
                    <div className="border border-[#CCCCCC]/80 rounded-[20px] p-[15px] flex justify-center items-center">
                        <img className="inline-block w-[250px]" src={twoFactorData?.QRCode} alt='' />
                    </div>
                }
                <FormField
                    type='text'
                    name='code'
                    className="ip__input mb-5 mt-5"
                    placeholder='Enter Code'
                    onChange={(e) => {
                        if (errors.code) clearErrors();
                        return !Number.isNaN(Number(e.target.value)) && setValue('code', e.target.value)
                    }}
                    onKeyDown={checkInputIsNumber}
                    fieldLimit={6}
                    control={control}
                    error={errors.code}
                    inputMode="numeric"
                    register={register}
                />
                <Button
                    className="w-full bg-black text-[16px] font-biotif__SemiBold text-center rounded-[12px] py-[16px]"
                    type="submit"
                    isDisabled={watch("code").length !== 6}
                >
                    Verify
                </Button>
            </form>
        </AuthCard>
    )
}

export default TowFactorVerify