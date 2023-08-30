import {IIdUuidHolderRequestBody} from '../../../core/models/request';
import {DppAnnualPhasingConstant} from "../constants/dpp-annual-phasing.constant";
import {ITppPhasingCostTotal} from './tpp-phasing-cost-total';
import {ITppAnnualPhasingCostTabDetails} from './tpp-annual-phasing-cost-tab-details';

export interface ITppAnnualPhasingCost extends IIdUuidHolderRequestBody {
    projectConceptUuid: string,
    projectConceptId: number,
    componentName: DppAnnualPhasingConstant,
    tappAnnualPhasingCostTotal: ITppPhasingCostTotal,
    tappAnnualPhasingCostTabDetails: ITppAnnualPhasingCostTabDetails[],
}
