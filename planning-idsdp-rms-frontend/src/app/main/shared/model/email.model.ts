export class EmailModel{
    to: string;
    from?: string;
    subject: string;
    body: string;
    templateName: string;
    isAttachment: boolean;
    attachmentUrl?: string;
    attachmentName?: string;
}
