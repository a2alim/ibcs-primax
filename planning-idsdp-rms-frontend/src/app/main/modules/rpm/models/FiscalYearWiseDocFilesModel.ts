import { ExpertEvaluator } from "../../settings/models/expert-evaluator.model";

export class FiscalYearWiseDocFilesModel {

    id: number;
    uuid: string;
    stFiscalYearId: number;
    fileFor: string;
    fileShortDescription: string;

    fileDownloadUrl: string;
    bucketName: string;
    fileName: string;

}
