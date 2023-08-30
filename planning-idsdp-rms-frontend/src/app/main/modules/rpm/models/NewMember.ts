import {ResearcherPresentation} from "./ResearcherPresentation";

export class NewMember {

    id: number;
    uuid: string;
    m2ResearcherPresentationId: number;
    evaluatorName: string;
    profileSummary: number;
    stCommonTypeId: number;
    isEditable: number;
    researcherPresentationDto: ResearcherPresentation;
}
