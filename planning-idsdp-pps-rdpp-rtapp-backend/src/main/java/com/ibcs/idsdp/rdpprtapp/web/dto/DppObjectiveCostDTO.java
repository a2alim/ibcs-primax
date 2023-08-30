package com.ibcs.idsdp.rdpprtapp.web.dto;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.rdpprtapp.web.dto.response.SectorDivision;
import lombok.Data;

import javax.persistence.Column;
import java.time.LocalDate;
import java.util.List;

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
    private LocalDate cumulativeDate;
    private Boolean timeExtension;
    private Boolean costExtension;
    private List<DppModeFinancingDTO> modeFinanceList;
    private List<DppCurrencyRateDTO> currencyRateList;
    private List<DppDevelopmentPartnersDTO> developmentPartnersList;
//    private Boolean status;
    private String status;
    private Long dppMasterId;
    private String fsUuid;
    private String revisedVersion;
    private Integer revisedVersionNumber;
    private Long referenceId;
    private String referenceUuid;
    private SectorDivision sectorDivision;

    private String ecnecId;
    private String revisedVersionBn;
    private String ppsCode;
    private DppAnnualPhasingCostTotalDTO grandTotal;
}
