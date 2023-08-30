export class EstimatedCostModel {
    id:               number;
    uuid:             string;
    fiscalYear:       string;
    qty:              number;
    totalAmount:      number;
    gobAmount:        number;
    gobFeAmount:      number;
    gobThruAmount:    number;
    spAcAmount:       number;
    thruPdAmount:     number;
    thruDpAmount:     number;
    ownFundAmount:    number;
    ownFundFeAmount:  number;
    otherAmount:      number;
    otherFeAmount:    number;
    totalProjectCost: number;
    dateCommencement: Date;
    dateCompletion:   Date;
    revisedVersion:   string;
    paAmount:         number;
    revisedStartYear: number;
    revisedEndYear:   number;
    costTotal: any;
}
