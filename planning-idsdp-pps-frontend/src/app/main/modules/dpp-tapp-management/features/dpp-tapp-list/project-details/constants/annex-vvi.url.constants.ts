import { environment } from "environments/environment";

export class AnnexVVIUrlConstants{
    public static BASE_ENDPOINT = environment.ibcs.ppsDppBackendPoint;
    public static ANNEXVVI_BASE_ENDPOINT = AnnexVVIUrlConstants.BASE_ENDPOINT + "project-details-partb";
    public static CREATE_ANNEXVVI = AnnexVVIUrlConstants.ANNEXVVI_BASE_ENDPOINT + "/create-annex-vvi";
    public static GET_ANNNEX_V_VI = AnnexVVIUrlConstants.ANNEXVVI_BASE_ENDPOINT + "/get-annex-v-vi";
    public static UPDATE_ANNEX_V_VI = AnnexVVIUrlConstants.ANNEXVVI_BASE_ENDPOINT + "/updateAnnex";
    public static DOWNLOAD_ATTACHMENT = AnnexVVIUrlConstants.BASE_ENDPOINT;

}
