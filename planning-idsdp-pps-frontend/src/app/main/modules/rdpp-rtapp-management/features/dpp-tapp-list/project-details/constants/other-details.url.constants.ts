import { environment } from "environments/environment";

export class OtherDetailsUrlConstant{
    public static BASE_ENDPOINT = environment.ibcs.ppsDppBackendPoint;
    public static OTHER_DETAILS_BASE_ENDPOINT = OtherDetailsUrlConstant.BASE_ENDPOINT + "project-details-partb";
    public static CREATE_OTHER_DETAILS = OtherDetailsUrlConstant.OTHER_DETAILS_BASE_ENDPOINT + "/create-other-details"
    public static GET_OTHER_DETAILS = OtherDetailsUrlConstant.OTHER_DETAILS_BASE_ENDPOINT + "/getOtherDetails"
    public static UPDATE_OTHER_DETAILS = OtherDetailsUrlConstant.OTHER_DETAILS_BASE_ENDPOINT + "/updateOtherDetails";

}
