import {IIdUuidHolderRequestBody} from '../../../core/models/request';
import {IDppAnnualPhasingCostTabDetails} from './dpp-annual-phasing-cost-tab-details';
import {IDppPhasingCostTotal} from './dpp-phasing-cost-total';
import {DppAnnualPhasingConstant} from "../constants/dpp-annual-phasing.constant";

export interface IDppAnnualPhasingCost extends IIdUuidHolderRequestBody {
    projectConceptUuid: string,
    projectConceptId: number,
    componentName: DppAnnualPhasingConstant,
    dppAnnualPhasingCostTotal: IDppPhasingCostTotal,
    dppAnnualPhasingCostTabDetails: IDppAnnualPhasingCostTabDetails[],
}
