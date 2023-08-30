import {IIdUuidHolderRequestBody} from '../../../core/models/request';
import {SubEconomicCodeModel} from '../../configuration-management/models/sub-economic-code-model';
import {UnitTypeModel} from '../../configuration-management/models/unit-type.model';
import {EconomicTypeModel} from '../../configuration-management/models/economic-code-model';

export interface IYearWisePhysicalAndFinancialTarget extends IIdUuidHolderRequestBody{
    projectConceptUuid: string,
    projectConceptId: number,
    componentName: string
    details?: IDppAnnualPhasingCostDetails[];
    fiscalYear:   [],

}


export interface IDppAnnualPhasingCostDetails extends IIdUuidHolderRequestBody{

    economicCodeId: number,
    subEconomicCodeId: number,
    description: string,
    unitId: number,
    unitCost: number,
    qty: number,
    totalAmount: number,
    weight: number,
    economicCodeDTO: EconomicTypeModel,
    subEconomicCodeDTO: SubEconomicCodeModel,
    unitTypeDTO: UnitTypeModel,
    years: FinancialYears[];
    fiscalYear:   [],

}

export interface FinancialYears extends IIdUuidHolderRequestBody{

    fiscalYear: string,
    month: number,
    financialAmount: number,
    percentageOfItem: number,
    percentageOfProject: number,

}
