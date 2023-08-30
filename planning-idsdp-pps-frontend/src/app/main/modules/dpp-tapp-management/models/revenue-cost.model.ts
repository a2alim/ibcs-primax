import {FinancialYearCostModel} from './financial-year-cost.model';

export class RevenueCostModel {

    projectConceptId: string;
    tabNo: string;

    // Table Variable
    economicCodeText: string;
    economicSubCodeText: string;
    codeDescriptionText: string;
    unitText: string;
    qtyText: number;
    unitCostText: number;
    totalCostText: number;

    // Project Total Variable
    gobText: number;
    feText: number;
    thruGobText: number;
    spAcText: number;
    thruPdText: number;
    thruDpText: number;
    ownFundFeText: number;
    ownFeFundFeText: number;
    otherFeText: number;
    feOtherFeText: number;
    fiscalYears: Array<FinancialYearCostModel>;
}
