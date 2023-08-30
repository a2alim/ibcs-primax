export class InstallmentProcessModel {
    id: number;
    uuid: string;
    proposalId: number;
    researchtitle: string;
    stInstallmentTypeId: number;
    percentageAmount: number;
    tkAmount: number;
    installmentDate: Date;
    subject: string;
    mailBody: string;
    installmentStatus: string = 'Pending';
    "isSend": boolean = false;
    installmentTypes: string;
    prcAmount: string;
    totalAmount: string;
    installmentTypesData:any;
}
