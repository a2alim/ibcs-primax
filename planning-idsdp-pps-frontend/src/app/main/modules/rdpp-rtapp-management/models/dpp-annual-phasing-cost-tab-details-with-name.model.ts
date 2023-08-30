import {IFiscalYearRequest} from "./fiscal-year-request";
import {IDppAnnualPhasingCost} from "./dpp-annual-phasing-cost";
import {UnitTypeModel} from "../../configuration-management/models/unit-type.model";

export class DppAnnualPhasingCostTabDetailsWithName{

    attachmentId: number;
    isMajor: boolean;
    economicCodeId: number;
    subEconomicCodeId: number;
    economicCodeName: string;
    subEconomicCodeName: any;
    description: string;
    unitId: number;
    unitName: any;
    unitCost: number;
    qty: number;
    totalAmount: number;
    otherFe: number;
    gobAmount: number;
    gobFeAmount: number;
    gobThruAmount: number;
    spAcAmount: number;
    thruPdAmount: number;
    thruDpAmount: number;
    ownFundAmount: number;
    ownFundFeAmount: number;
    otherAmount: number;
    otherFeAmount: number;
    fiscalYears?: IFiscalYearRequest[];
    dppAnnualPhasingCost?: IDppAnnualPhasingCost;
    unitTypeDTO?: UnitTypeModel;
}
