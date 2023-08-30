export interface AgreementResponse {
    agreementDate: String;
    agreementInstallments: AgreementInstallmentResponse[];
    agreementStatus: String;
    amountOfGrant: number;
    createdBy: String;
    createdOn: Date;
    guarantor: String;
    guarantorId: number;
    id: number;
    isDeleted: boolean;
    noOfInstallment: number;
    onBehalf: AgreementPartiesResponse;
    traineeRecommended: number;
    trainingId: number;
    updatedBy: String;
    updatedOn: Date;
    uuid: String;
    witness: AgreementPartiesResponse
    fiscalYearId: number;
}

export interface AgreementPartiesResponse {
    createdBy: String;
    createdOn: Date;
    firstPartyAddress: String;
    firstPartyName: String;
    firstPartySurname: String;
    id: number;
    isDeleted: boolean;
    secondPartyAddress: String;
    secondPartyEmail: String;
    secondPartyName: String;
    secondPartyNidNo: String;
    secondPartyPhoneNo: String;
    secondPartySurname: String;
    updatedBy: String;
    updatedOn: Date;
    uuid: String;
}

export interface AgreementInstallmentResponse {
    createdBy: String;
    createdOn: Date;
    id: number;
    isDeleted: boolean;
    percentageOfInstallment: number;
    totalAmount: number;
    updatedBy: String;
    updatedOn: String;
    uuid: String;
}
