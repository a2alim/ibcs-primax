import { BaseUrlConstant } from "app/main/core/constants/base.url.constant";
import { environment } from "environments/environment";

export class ProjectDetailsPartBUrlConstant{

    public static BASE_ENDPOINT = environment.ibcs.ppsDppBackendPoint;

    public static CREATE_PROJECT_DETAILS = ProjectDetailsPartBUrlConstant.BASE_ENDPOINT + "create-project-details-partb"
    public static GET_PROJECT_DETAILS = ProjectDetailsPartBUrlConstant.BASE_ENDPOINT + "getProjctDetails"
    public static UPDATE_PROJECT_DETAILS = ProjectDetailsPartBUrlConstant.BASE_ENDPOINT + "updateProjectDetails";

}
