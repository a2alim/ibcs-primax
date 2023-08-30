package com.ibcs.idsdp.dpptapp.web.dto.response;

import lombok.Data;

import java.time.LocalDate;


@Data
public class ProjectInfoToGisDTO {
    private Long projectId;
    private String projectCode;
    private String source;
    private String projectName;
    private String totalCost;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private String beneficiary;
    private String projectObjection;
    private String agency;
    private Long agencyId;
    private String ministryDivision;
    private Long ministryDivisionId;
    private Long sector;
    private String sectorName;
    private String sectorNameBn;
    private Long subSector;
    private String subSectorName;
    private String subSectorNameBn;
    private DppLocationResponse location;
}
