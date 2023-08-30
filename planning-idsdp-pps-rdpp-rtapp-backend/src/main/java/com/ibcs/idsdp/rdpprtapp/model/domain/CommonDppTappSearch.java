package com.ibcs.idsdp.rdpprtapp.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import com.ibcs.idsdp.rdpprtapp.approval_process_flow.model.domain.MovementStageEnum;
import com.ibcs.idsdp.rdpprtapp.web.dto.DppAnnualPhasingCostTotalDTO;
import lombok.Data;

import javax.persistence.*;
import java.time.LocalDate;

@Data
public class CommonDppTappSearch extends BaseEntity {
    private String projectTitleEn;
    private String projectTitleBn;
    private String ministryDivision;
    private String implementingAgency;
    private String objectivesTargets;
    private Long concernedDivisionId;
    private String projectConceptUuid;
    private Long projectConceptMasterId;
//    private Long dppMasterId;
    private LocalDate dateCommencement;
    private LocalDate dateCompletion;
    private Boolean timeExtension;
    private Boolean costExtension;
    private Boolean status;
//    private String fsUuid;
    private String revisedVersion;
    private Long referenceId;
    private String referenceUuid;
    private MovementStageEnum projectStatus;
    private int total;
    @Transient
    private DppAnnualPhasingCostTotalDTO grandTotal;
}
