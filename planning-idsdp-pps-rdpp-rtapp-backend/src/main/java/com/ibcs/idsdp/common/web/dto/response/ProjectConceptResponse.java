package com.ibcs.idsdp.common.web.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class ProjectConceptResponse {
    private Long id;
    private String uuid;
    private String titleEn;
    private String titleBn;
    private LocalDate expCommencementDate;
    private LocalDate expCompletionDate;
    private Long projectTypeId;
    private Double gobAmount;
    private Double paAmount;
    private Double rpaAmount;
    private Double dpaAmount;
    private Double ownFundAmount;
    private Double otherAmount;
    private String projectCode;
    private Double totalAmount;
    private Double feGobAmount;
    private Double feOwnFundAmount;
    private Double feOtherAmount;
    private Boolean isSelfFund;
    private Boolean isForeignAid;
    private Long sectorDivisionId;
    private String sponsoringMinistryName;
    private String implementingAgencyName;
    private Long sectorId;

    private ProjectType projectTypeDTO;
}
