export interface ProfassionalExprienceFormModel {

    id: number;
    profilePersonalInfoId: number;
    organizationName: string;
    designation: string;
    isGovEmployee: 1 | 2 | 0; // 1=Govt, 2=Private, 0=Other
    fromDate: Date;
    toDate: Date;
    isContinue: boolean;
    responsibilityDetail: string;
    uploadRelevantDoc: string;
    isEditable: boolean;
    isToDateDisable: boolean;
}
