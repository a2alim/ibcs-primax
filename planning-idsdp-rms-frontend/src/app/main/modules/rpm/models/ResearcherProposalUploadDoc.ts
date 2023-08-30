export class ResearcherProposalUploadDoc {

    id: number;
    uuid: string;
    researcherProposalId: number;
    researcherProposalUuid: string;
    stDocumentTypeId: number;
    docName: string;
    briefOnDocument: string;
    fileDownloadUrl: string;
    bucketName: string;
    fileName: string;
    isEditable: number;
    deleted: number = 0;
    documentTypeName : string
    // createdOn: Date;

}
