package com.ibcs.idsdp.dpptapp.web.dto.response;

import com.ibcs.idsdp.dpptapp.web.dto.ShortLocationWiseBreakdownDTO;
import com.ibcs.idsdp.dpptapp.web.dto.dashboardDTO.AnnexureAmountDTO;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;


@Data
public class AmsUnapprovedProjectDetailInfoDTO {
    private Long ppsId;
    private Long amsId;
    private String datasource;
    private String projectName;
    private String projectNameBn;
    private String ministryCode;
    private String agencyCode;
    private String adpSectorCode;
    private String adpSubSectorCode;
    private LocalDate dateOfCommencement;
    private LocalDate dateOfCompletion;
    private Integer projectType;
    private String projectDocType;
    private String projectObjectives;

    private String EnvironmentCategory; //dpp part b 26.1
    private String eca;
    private String eia;
    private String landRequired;
    private String specificLinkage; //dpp part b 27

    private AnnexureAmountDTO estimatedCost;
    private List<AnnualCostTotalWithFiscalYear> yearWiseEstimatedCost;
    private List<ShortLocationWiseBreakdownDTO> locationWiseCost;
}
