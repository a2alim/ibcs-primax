package com.ibcs.idsdp.feasibilitystudy.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.feasibilitystudy.approval_process_flow.model.domain.MovementStageEnum;
import com.ibcs.idsdp.feasibilitystudy.client.dto.response.UserGroupResponse;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Date;

@Setter
@Getter
public class ProjectConceptMasterDTO extends UuidIdHolderRequestBodyDTO {
    private long paripatraVersionId;
    private String projectCode;
    private Long projectTypeId;
    private Long priorityId;
    private String titleEn;
    private String titleBn;
    private String objectivesEn;
    private String objectivesBn;
    private LocalDate expCommencementDate;
    private LocalDate expCompletionDate;
    private Double totalAmount;
    private Double gobAmount;
    private Double feGobAmount;
    private Double ownFundAmount;
    private Double feOwnFundAmount;
    private Double paAmount;
    private Double rpaAmount;
    private Double dpaAmount;
    private Double otherAmount;
    private Double feOtherAmount;
    private Long sectorDivisionId;
    private Long sectorId;
    private Long subSectorId;
    private Long mainCofogId;
    private Long optionalCofogId;
    private Long detailsCofogId;
    private Boolean isSelfFund;
    private Boolean isForeignAid;
    private String agreementNo;
    private Long agreementAttachmentId;
    private Long agencyId;
    private String agreementAttachmentName;

    private LocalDate createdDate;
    private String sponsoringMinistryName;
    private String implementingAgencyName;
    private String sourceModuleType;

    private Long pcLinkId;
    private String ppsCode;
    private Long amsId;
    private String amsCode;
    private String financeCode;
    private Date movementDate;

    private MovementStageEnum status;
    private UserGroupResponse userGroup;
    private ProjectTypeDTO projectTypeDTO;
}
