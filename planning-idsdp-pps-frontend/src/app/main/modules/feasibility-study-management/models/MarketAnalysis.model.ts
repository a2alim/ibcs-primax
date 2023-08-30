import {MarketAnalysisAttachmentModel} from './market-analysis-attachment.model';

export class MarketAnalysisModel {
    prbStatement: string;
    relevanceProjectIdea: string;
    proposedProjectInterventions: string;
    stakeholders: string;
    currentDemand: string;
    futureDemand: string;
    variousDemand: string;
    swotAnalysis: string;
    attachment = new MarketAnalysisAttachmentModel();
    fsrMasterId: number;

}
