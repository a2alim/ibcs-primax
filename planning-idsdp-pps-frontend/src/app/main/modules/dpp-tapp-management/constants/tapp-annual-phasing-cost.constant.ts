import {environment} from '../../../../../environments/environment';

export class TappAnnualPhasingCostConstant {

    static TAPP_ANNUAL_PHASING_COST = environment.ibcs.ppsDppBackendPoint + 'tappAnnualPhasingCost/';
    // static TAPP_ANNUAL_PHASING_COST = 'tappAnnualPhasingCost/create';
    static CREATE_ANNUAL_PHASING_COST = 'tappAnnualPhasingCost/create';
    static GET_GRAND_Total = 'amortizationSchedule/getGrandTotalAnnuals';
    static GET_ALL_GRAND_Total = 'amortizationSchedule/getAll';
    static GET_ALL_BY_PCUUID = 'tappAnnualPhasingCost/getAllByProjectConceptUuid';
    static GET_ANNUAL_PHASING_COST_BY_PCUUID_AND_TYPE = 'tappAnnualPhasingCost/getAnnualPhasingCostByPCUuidAndComponentType';
    static CREATE_WITH_CHILD = 'createWithChild';
    static UPDATE_WITH_CHILD = 'updateWithChild';
    static GET_BY_PROJECT_CONCEPT_ID_AND_COMPONENT_NAME = 'getByProjectConceptIdAndComponentName';
    static GET_GRAND_TOTAL_BY_PROJECT_CONCEPT_ID = 'getGrandTotalByProjectConceptId';
    static GET_BY_PROJECT_CONCEPT_ID_FOR_CHECKING_FISCAL_YEAR = 'getProjectConceptIdForCheckingFiscalYear';
    static GET_DETAILS_ESTIMATED_COST = 'getDetailsEstimatedCost';
}

