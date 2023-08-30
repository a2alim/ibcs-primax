import {IIdUuidHolderRequestBody} from '../../../core/models/request';

export interface IProjectConceptSummary extends IIdUuidHolderRequestBody {

    projectConceptMasterId: number;
    agreementAttachmentId: number;

    catEnvRulesId: number;
    isEcaRequired: boolean;
    descriptionEca: string;
    ecaAttachmentId: number;
    isEiaRequired: boolean;
    descriptionEia: string;
    eiaAttachmentId: number;
    isLandRequired: boolean;
    descriptionLand: string;
    landAttachmentId: number;
    isFeasibilityRequired: boolean;
    descriptionFs: string;
    fsAttachmentId: number;
    isPppRequired: boolean;
    descriptionPpp: string;
    pppAttachmentId: number;
    relevanceWithShortProgram: string;
    relevanceWithShortProgramAttachmentId: number;
    relevanceWithProposal: string;
    relevanceWithProposalAttachmentId: number;
    institutionalArrangement: string;
    institutionalArrangementAttachmentId: number;
    relevanceWithOtherDevelopment: string;
    relevanceWithOtherDevelopmentAttachmentId: number;
    expectedBenefits: string;
    expectedBenefitsAttachmentId: number;

    ecaAttachmentName: string;
    eiaAttachmentName: string;
    landAttachmentName: string;
    fsAttachmentName: string;
    pppAttachmentName: string;
    relevanceWithShortProgramAttachmentName: string;
    relevanceWithProposalAttachmentName: string;
    institutionalArrangementAttachmentName: string;
    relevanceWithOtherDevelopmentAttachmentName: string;
    expectedBenefitsAttachmentName: string;

    // agreementAttachment: any;
    // ecaAttachment: any;
    // eiaAttachment: any;
    // landAttachment: any;
    // fsAttachment: any;
    // pppAttachment: any;
    // relevanceWithShortProgramAttachment: any;
    // relevanceWithProposalAttachment: any;
    // institutionalArrangementAttachment: any;
    // relevanceWithOtherDevelopmentAttachment: any;
    // expectedBenefitsAttachment: any;
}
