// ** Constants **
import { BasicPermissionTypes, ModuleNames } from "constant/permissions.constant";

export interface RequiresAuthProps {
    children: JSX.Element;
    module?: ModuleNames;
    type?: BasicPermissionTypes;
}