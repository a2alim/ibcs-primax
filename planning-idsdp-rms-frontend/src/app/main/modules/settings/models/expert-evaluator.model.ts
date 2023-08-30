import { ExpertEvaluatorBySsrc } from "./expert-evaluator-by-ssrc";
import { ExpertEvaluatorEducation } from "./expert-evaluator-education-model";
import { ExpertEvaluatorSectorSubSector } from "./expert-evaluator-sector-subsector-model";

export class ExpertEvaluator {
    id: number;
    name: string;
    userId: number;
    presentProfession: string;
    presentOfficeNameAddress: string;
    stSpecialityTypeId: number;
    dateOfBirth: Date;
    thesisGroup: boolean;
    mobileNo: string;
    emailAddress: string;
    totalResearchExpYear: number;
    researchExperienceDetail: string;
    otherExpertAreas: string;
    nidNumber: string;
    tinNumber: string;
    evaluatortype: number;
    educations: ExpertEvaluatorEducation[] = [];
    sectorSubSectors: ExpertEvaluatorSectorSubSector[] = [];
    expertEvaluatorBySsrc: ExpertEvaluatorBySsrc;
    nationalPublicationsNumber:number;
    internationalPublicationsNumber:number;

}
