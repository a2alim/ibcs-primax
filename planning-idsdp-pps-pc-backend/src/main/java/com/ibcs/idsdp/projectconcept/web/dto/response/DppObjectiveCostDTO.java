package com.ibcs.idsdp.projectconcept.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

import java.time.LocalDate;

@Data
public class DppObjectiveCostDTO extends UuidIdHolderRequestBodyDTO {
    private String uuid;
    private Long id;
    private String projectConceptUuid;
    private Long projectConceptMasterId;
    private Long paripatraVersionId;
    private String projectTitleEn;
    private String projectTitleBn;
    private String ministryDivision;
    private String implementingAgency;
    private String objectivesTargets;
    private Long concernedDivisionId;
    private LocalDate dateCommencement;
    private LocalDate dateCompletion;
    private Boolean status;
    private Long dppMasterId;
    private String fsUuid;
    private String ppsCode;
    private String amsCode;
    private String financeCode;
}
