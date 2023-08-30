export interface UploadFileFormModel{
    id: number;
    uuid: string;
    goLetterId: number;
    fileTitle: string;
    bucketName: string;
    fileName: string;
    downloadUrl: string;
    isEditable: number;
    deleted: number;
}

export interface UploadFileActionFormModel{
    id: number;
    uuid: string;
    takeActionForResearchId: number;
    fileTitle: string;
    bucketName: string;
    fileName: string;
    downloadUrl: string;
    isEditable: number;
    deleted: number;
}

export interface UploadbankChequeFileFormModel{
    id: number;
    uuid: string;
    receivedBankChequeId: number;
    fileTitle: string;
    bucketName: string;
    fileName: string;
    downloadUrl: string;
    isEditable: number;
    deleted: number;
}
