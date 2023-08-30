package com.ibcs.idsdp.projectconcept.web.dto;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Setter
@Getter
public class ProjectConceptSummaryDTO extends UuidIdHolderRequestBodyDTO {

    private long projectConceptMasterId;

    private long catEnvRulesId;

    private Boolean isEcaRequired;

    private String descriptionEca;

    private Long ecaAttachmentId;

    private Boolean isEiaRequired;

    private String descriptionEia;

    private Long eiaAttachmentId;

    private Boolean isLandRequired;

    private String descriptionLand;

    private Long landAttachmentId;

    private Boolean isFeasibilityRequired;

    private String descriptionFs;

    private Long fsAttachmentId;

    private Boolean isPppRequired;

    private String descriptionPpp;

    private Long pppAttachmentId;

    private String relevanceWithShortProgram;

    private Long relevanceWithShortProgramAttachmentId;

    private String relevanceWithProposal;

    private Long relevanceWithProposalAttachmentId;

    private String institutionalArrangement;

    private Long institutionalArrangementAttachmentId;

    private String relevanceWithOtherDevelopment;

    private Long relevanceWithOtherDevelopmentAttachmentId;

    private String expectedBenefits;

    private Long expectedBenefitsAttachmentId;

    private String ecaAttachmentName;

    private String eiaAttachmentName;

    private String landAttachmentName;

    private String fsAttachmentName;

    private String pppAttachmentName;

    private String relevanceWithShortProgramAttachmentName;

    private String relevanceWithProposalAttachmentName;

    private String institutionalArrangementAttachmentName;

    private String relevanceWithOtherDevelopmentAttachmentName;

    private String expectedBenefitsAttachmentName;

}
