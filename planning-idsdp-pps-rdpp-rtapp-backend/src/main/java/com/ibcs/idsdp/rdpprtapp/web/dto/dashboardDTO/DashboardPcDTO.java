package com.ibcs.idsdp.rdpprtapp.web.dto.dashboardDTO;

import lombok.Data;

import java.time.LocalDate;

@Data
public class DashboardPcDTO {
    private Long id;
    private String projectTitleEn;
    private String projectTitleBn;
    private LocalDate dateCommencement;
    private LocalDate dateCompletion;

    private Long pcId;
    private String titleEn;
    private String titleBn;
    private Long projectTypeId;
    private Double gobAmount;
    private Double paAmount;
    private Double ownFundAmount;
    private Double otherAmount;
    private LocalDate expCommencementDate;
    private LocalDate expCompletionDate;
    private Long sectorDivisionId;

    private String sponsoringMinistryName;

    private String implementingAgencyName;

//    private String projectCode;
//    private Double totalAmount;
//    private Double feGobAmount;
//    private Double feOwnFundAmount;
//    private Double feOtherAmount;
//    private Boolean isSelfFund;
//    private Boolean isForeignAid;
}
