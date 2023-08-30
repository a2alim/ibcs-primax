import {AgreementInstallmentModel} from "./agreement-installments.model";
import {AgreementPartiesModel} from "./agreement-parties.model";

export class AgreementModel {
    agreementDate: Date;
    agreementInstallments: AgreementInstallmentModel[];
    amountOfGrant: number;
    fiscalYearId: number;
    guarantorId: number;
    guarantorName: string;
    noOfInstallment: number;
    onBehalf: AgreementPartiesModel;
    proposalId: number;
    traineeRecommended: number;
    witness: AgreementPartiesModel;
}

