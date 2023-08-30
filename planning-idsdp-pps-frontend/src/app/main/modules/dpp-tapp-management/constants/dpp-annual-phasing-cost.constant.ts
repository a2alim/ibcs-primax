import {environment} from '../../../../../environments/environment';

export class DppAnnualPhasingCostConstant {

    static DPP_ANNUAL_PHASING_COST = environment.ibcs.ppsDppBackendPoint + 'dppAnnualPhasingCost/';
    // static DPP_ANNUAL_PHASING_COST = 'dppAnnualPhasingCost/create';
    static CREATE_ANNUAL_PHASING_COST = 'dppAnnualPhasingCost/create';
    static GET_GRAND_Total = 'amortizationSchedule/getGrandTotalAnnuals';
    static GET_ALL_GRAND_Total = 'amortizationSchedule/getAll';
    static GET_ALL_BY_PCUUID = 'dppAnnualPhasingCost/getAllByProjectConceptUuid';
    // MTBF services  
    static GET_MTBF_BY_PCUUID = 'dpp-mtbf/get-by-pc-uuid';
    

     // MAF services  
     static GET_MAF_BY_PCUUID = 'maf-saf/get-by-pc-uuid';


    static GET_ANNUAL_PHASING_COST_BY_PCUUID_AND_TYPE = 'dppAnnualPhasingCost/getAnnualPhasingCostByPCUuidAndComponentType';
    static CREATE_WITH_CHILD = 'createWithChild';
    static UPDATE_WITH_CHILD = 'updateWithChild';
    static GET_BY_PROJECT_CONCEPT_ID_AND_COMPONENT_NAME = 'getByProjectConceptIdAndComponentName';
    static GET_GRAND_TOTAL_BY_PROJECT_CONCEPT_ID = 'getGrandTotalByProjectConceptId';
    static GET_BY_PROJECT_CONCEPT_ID_FOR_CHECKING_FISCAL_YEAR = 'getProjectConceptIdForCheckingFiscalYear';
    static GET_DETAILS_ESTIMATED_COST = 'getDetailsEstimatedCost';
    static GET_YEAR_WISE_PHYSICAL_AND_FINANCIAL_TARGET_BY_PROJECT_CONCEPT_ID = 'getYearWisePhysicalAndFinancialTargetByConceptId';
}

