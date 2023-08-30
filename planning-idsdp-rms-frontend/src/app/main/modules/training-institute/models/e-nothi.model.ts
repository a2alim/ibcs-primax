export class ENothiModel {
    enothi:       FileUploadModel;
    fiscalYearId: number;
}

export class FileUploadModel {
    bucketName:  string;
    createdBy:   string;
    createdOn:   Date;
    downloadUrl: string;
    fileName:    string;
    id:          number;
    isDeleted:   boolean;
    updatedBy:   string;
    updatedOn:   Date;
    uuid:        string;
}