import { environment } from "environments/environment";
import { FinancialAnalysisUrlConstant } from "./financial-analysis.url.constant";

export class SimilarProjectStudyUrlConstant{
    public static BASE_ENDPOINT = environment.ibcs.ppsDppBackendPoint;
    public static FINANCIAL_BASE_ENDPOINT = SimilarProjectStudyUrlConstant.BASE_ENDPOINT + "project-details-partb";
    public static CREATE_SIMILAR_PROJECT_STUDY = SimilarProjectStudyUrlConstant.FINANCIAL_BASE_ENDPOINT + "/create-similar-project-study";
    public static GET_SIMILAR_PROJECT_STUDY = SimilarProjectStudyUrlConstant.FINANCIAL_BASE_ENDPOINT + "/getSimilarProjectStudy";
    public static UPDATE_SIMILAR_PROJECT_STUDY = SimilarProjectStudyUrlConstant.FINANCIAL_BASE_ENDPOINT + "/updateSimilarProjectStudy";
    public static GET_MAJOR_ITEM= SimilarProjectStudyUrlConstant.FINANCIAL_BASE_ENDPOINT + "/getMajorItem";
}
