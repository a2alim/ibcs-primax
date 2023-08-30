export interface FiscalYearWiseSectorSubSector {
    certificationName: string;
    passingYearMonth: string;
    division: string;
    orCgpa:string;
    instituteName:string;
    isForeign:boolean;
    uploadCertificateImage :string;
    universityRegNoForPhDMPhil :string;

    stFiscalYearIid:bigint;
    stSectorTypeId:bigint;
    stSubSectorId:bigint;
}
