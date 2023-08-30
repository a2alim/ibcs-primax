export class ApprovalValueSetupModel {
    uuid: string;
    code: string;
    paripatroVersionNo: {
        id:number,
        nameEn:string
    };
    approvalValueForModule: number;
    projectType: {
        id:number,
        nameEn:string
    };
    amount: string;
    description: string;
    status: boolean;

}

