import { yupResolver } from "@hookform/resolvers/yup";
import Button from "components/Button";
import FormField from "components/FormField";
import { resetPasswordSchema } from "pages/auth/ResetPassword/validation-schema/reset-password.schema";
import { useForm } from "react-hook-form";
import { useLazyUpdatePasswordQuery } from "redux/api/authApi";
import { PasswordFields } from "../types/login.types";


const PasswordExpired = ({ isVerified }: { isVerified: () => Promise<void>; }) => {
    const [updatePassword] = useLazyUpdatePasswordQuery()

    // ** Custom Hooks **
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<PasswordFields>({
        resolver: yupResolver(resetPasswordSchema),
    });

    const onSubmit = handleSubmit(async (value: PasswordFields) => {
        if (value.password) {
            const { data } = await updatePassword({ data: { password: value.password } });
            if (data?.isValid) {
                isVerified()
            }

        }
    });
    return (
        <div className="card signup__Card w-[489px] max-w-full mx-auto mt-[20px]">
            <div className="signup__Card__Header">
                <h2 className="i__Heading">Update Password</h2>
                <p className="i__Text">Update Your Expired Password.</p>
            </div>
            <div className="signup__Card__Body">
                <form onSubmit={onSubmit}>
                    <FormField<PasswordFields>
                        key="password"
                        type="password"
                        name="password"
                        label="New Password"
                        placeholder="Enter Your New Password"
                        icon="securityFilled"
                        register={register}
                        error={errors?.password}
                    />
                    <FormField<PasswordFields>
                        key="confirmPassword"
                        type="password"
                        name="confirmPassword"
                        label="Confirm New Password"
                        placeholder="Confirm Your New Password"
                        icon="securityFilled"
                        register={register}
                        error={errors?.confirmPassword}
                    />
                    <p className="text-center text-colorBlack08 text-[18px] font-biotif__Regular mt-[30px] mb-[20px]">
                        {/* {error?.message} */}
                    </p>
                    <Button
                        className="w-full mt-[20px] mb-[20px]"
                        type="submit"
                    >
                        Submit
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default PasswordExpired