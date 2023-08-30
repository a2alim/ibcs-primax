import { environment } from "environments/environment";

export class FinancialAnalysisUrlConstant{

    public static BASE_ENDPOINT = environment.ibcs.ppsRdppRtappBackendPoint;
    public static FINANCIAL_BASE_ENDPOINT = FinancialAnalysisUrlConstant.BASE_ENDPOINT + "project-details-partb";
    public static CREATE_FINANCIAL_ANALYSIS = FinancialAnalysisUrlConstant.FINANCIAL_BASE_ENDPOINT + "/create-financial-analysis";
    public static UPDATE_FINANCIAL_ANALYSIS = FinancialAnalysisUrlConstant.FINANCIAL_BASE_ENDPOINT + "/update-financial-analysis";
    public static ADD_FINANCIAL_ANALYSIS_ATTACHMENT = FinancialAnalysisUrlConstant.FINANCIAL_BASE_ENDPOINT + "/add-financial-analysis-attachment";
    public static GET_FINANCIAL_ANALYSIS = FinancialAnalysisUrlConstant.FINANCIAL_BASE_ENDPOINT + "/getFinancialAnalysis";
}
