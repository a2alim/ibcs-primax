import { environment } from "environments/environment";

export class FinancialAnalysisUrlConstant {

    public static BASE_ENDPOINT = environment.ibcs.ppsDppBackendPoint;
    public static FINANCIAL_BASE_ENDPOINT = FinancialAnalysisUrlConstant.BASE_ENDPOINT + "project-details-partb";
    public static CREATE_FINANCIAL_ANALYSIS = FinancialAnalysisUrlConstant.FINANCIAL_BASE_ENDPOINT + "/create-financial-analysis";
    public static UPDATE_FINANCIAL_ANALYSIS = FinancialAnalysisUrlConstant.FINANCIAL_BASE_ENDPOINT + "/update-financial-analysis";
    public static ADD_FINANCIAL_ANALYSIS_ATTACHMENT = FinancialAnalysisUrlConstant.FINANCIAL_BASE_ENDPOINT + "/add-financial-analysis-attachment";
    public static GET_FINANCIAL_ANALYSIS = FinancialAnalysisUrlConstant.FINANCIAL_BASE_ENDPOINT + "/getFinancialAnalysis";
    public static CREATE_FINANCIAL_ANALYSIS_CALCULATION = FinancialAnalysisUrlConstant.FINANCIAL_BASE_ENDPOINT + "/create-financial-analysis-calculation";
    public static GET_FINANCIAL_ANALYSIS_CALCULATION = FinancialAnalysisUrlConstant.FINANCIAL_BASE_ENDPOINT + "/get-financial-analysis-calculation";

}
