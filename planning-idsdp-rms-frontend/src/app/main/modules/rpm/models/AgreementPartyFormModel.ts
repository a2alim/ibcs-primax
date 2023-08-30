export class AgreementPartyFormModel {
    id: number;
    uuid: string;
    agreementId: string;
    firstPartyUserId: number;
    rmsUserSignatureIdOfFirstParty: number;
    firstPartyWitnessUserId: number;
    rmsUserSignatureIdOfWitnessUser: number;
    secondPartyUserId: number;
    rmsUserSignatureIdOf2ndParty: number;
    secondPartyWitnessName: string;
    agreementWithResearcherId: any;
    secondPartyWitnessDesignation: string;
    secondPartyWitnessAddress: string;
    secondPartyWitnessNid: string;
    secondPartyWitnessMobileNo: string;
    secondPartyWitnessEmail: string;
    isEditable: boolean = true;
    secondPartyWitnessTinNO: string;
}
