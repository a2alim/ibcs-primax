export class PersonalInfoFormModel {
    id: number;
    uuid: string;
    userId: number;
    dateOfBirth: Date;
    age: number;
    fatherName: string;
    motherName: string;
    emailAddress: string;
    mobileNo: string;
    researchTraining: string;
    nIDNumber: string;
    nIDVerificationStatus: string;
    tINNumber: string;
    tINVerificationStatus: string;
    occupation: string;
    designation: string;
    // rmsUploadUsersImageId :string;
    // rmsUserSignatureId :string;
    totalResearcherNumbers: string;

    //for permanet address
    preDivisionId: any;
    preDistrictId: any;
    preUpzilaId: any;
    //pre_unionId :any;
    preAnotherDetails: string;

    //for present address
    divisionId: any;
    districtId: any;
    upzilaId: any;
    //unionId :any;
    anotherDetails: string;

    detailsPresentAddress: string;
    isPending: boolean;
    isDraftApproval: boolean;
    isFinalApproval: boolean;
    //profileImage:File;

    accountName: any;
    accountNumber: any;
    nidNo: any;
    bankMobileNumber: any;
    fileDownloadUrl:any;
    bucketName:any;
    fileName: any;

    //FOR INSTITUTIONAL TAB//
    instYearOfEstablishment: number;
    instAddressDetails: string;
    instRegistrationNo: string;
    instTelephoneNo: string;
    instMobileNo: string;
    instTinNo: string;
    phd: number;
    mphil: number;
    masters: number;
    totalResearchExperience: number;
    isInstitutional: boolean = false;
    //============================
    instHeadName: string;
    fastClass: number;
    secondClass: number;
    thirdClass: number;
    fourthClass: number;

    instituteActivities: string;
    infrastructuralFacilities: string;
    nattionalIntResearchDescription: string;
    instHeadDesignation: string;
    bankName: string;
    bankBranchName: string;

}
