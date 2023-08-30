import { environment } from "environments/environment";

export class OtherImportantDetailsUrlConstants{
    public static BASE_ENDPOINT = environment.ibcs.ppsDppBackendPoint;
    public static OTHER_IMPORTANT_DETAILS_BASE_ENDPOINT = OtherImportantDetailsUrlConstants.BASE_ENDPOINT + "project-details-partb";
    public static CREATE_OTHER_IMPORTANT_DETAILS = OtherImportantDetailsUrlConstants.OTHER_IMPORTANT_DETAILS_BASE_ENDPOINT + "/create-other-important-details"
    public static GET_OTHER_IMPORTANT_DETAILS = OtherImportantDetailsUrlConstants.OTHER_IMPORTANT_DETAILS_BASE_ENDPOINT + "/getOtherImportantDetails"
    public static UPDATE_OTHER_IMPORTANT_DETAILS = OtherImportantDetailsUrlConstants.OTHER_IMPORTANT_DETAILS_BASE_ENDPOINT + "/updateOtherImportantDetails"
}
