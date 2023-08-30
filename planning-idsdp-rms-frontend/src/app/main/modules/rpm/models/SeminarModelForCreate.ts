export class SeminarModelForCreate {
    id: number;
    uuid: string;
    stFiscalYearId: number;
    subject: string;
    seminarNo: number;
    presentationType: number;
    presentationStatus: number;
    programNature: number;
    totalPresentationNo: number;
    startDate: string;
    endDate: string;
    dayName: string;
    presentationTime: string;
    bhavanNo: string;
    roomNo: string;
    roomName: string;
    paragraphOne: string;
    paragraphTwo: string;
    isEditable: boolean;
    memorandumNo: string;
    nothiDateEn: string;
    nothiDateBn: string;
    letterType : string;
    seminarDate : Date;
}
