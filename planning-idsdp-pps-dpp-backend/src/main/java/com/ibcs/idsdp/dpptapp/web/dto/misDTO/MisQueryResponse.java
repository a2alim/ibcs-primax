package com.ibcs.idsdp.dpptapp.web.dto.misDTO;

import com.ibcs.idsdp.common.web.dto.response.ProjectType;
import com.ibcs.idsdp.dpptapp.client.dto.request.SectorDivisionDTO;
import com.ibcs.idsdp.dpptapp.web.dto.dashboardDTO.AnnexureAmountDTO;
import lombok.Data;

import java.time.LocalDate;


@Data
public class MisQueryResponse {
    private Long projectConceptId;
    private String projectConceptUuid;
    private Long dppTappMasterId;
    private String dppTappMasterUuid;
    private String projectTitleEn;
    private String projectTitleBn;
    private String ministryDivision;
    private String implementingAgency;
    private LocalDate commencementDate;
    private LocalDate completionDate;
    private LocalDate createdDate;
    private String movementStatus;
    private String ppsCode;
    private ProjectType projectType;
    private SectorDivisionDTO sectorDivision;
    private AnnexureAmountDTO annexureAmount;
}
