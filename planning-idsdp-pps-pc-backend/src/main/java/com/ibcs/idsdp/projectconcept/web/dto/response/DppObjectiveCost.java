package com.ibcs.idsdp.projectconcept.web.dto.response;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;

import java.time.LocalDate;

@Data
public class DppObjectiveCost extends BaseEntity {

    private String projectTitleEn;

    private String projectTitleBn;

    private String ministryDivision;

    private String implementingAgency;

    private String objectivesTargets;

    private Long concernedDivisionId;

    private String projectConceptUuid;

    private Long projectConceptMasterId;

    private Long dppMasterId;

    private Long paripatraVersionId;

    private LocalDate dateCommencement;

    private LocalDate dateCompletion;

    private LocalDate cumulativeDate;

    private Boolean timeExtension;

    private Boolean costExtension;

    private Boolean status;

    private String fsUuid;

    private String revisedVersion;

    private Long referenceId;

    private String referenceUuid;

    private String ppsCode;

    private Boolean isEcnecAcknowledgement;

    private String ecnecId;
}
