import {FinancialYearCostModel} from './financial-year-cost.model';

export class DppGrandTotalResponseModel{

    projectConceptId: any;
    totalCostText: any;
    gobText: any;
    feText: any;
    thruGobText: any;
    spAcText: any;
    thruPdText: any;
    thruDpText: any;
    ownFundFeText: any;
    ownFeFundFeText: any;
    otherFeText: any;
    feOtherFeText: any;
    fiscalYears: Array<FinancialYearCostModel>;

}
