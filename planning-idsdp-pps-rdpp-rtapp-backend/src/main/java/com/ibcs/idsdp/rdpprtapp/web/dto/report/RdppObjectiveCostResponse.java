package com.ibcs.idsdp.rdpprtapp.web.dto.report;

import com.ibcs.idsdp.rdpprtapp.web.dto.DppAnnualPhasingCostTotalDTO;
import com.ibcs.idsdp.rdpprtapp.web.dto.DppCurrencyRateDTO;
import com.ibcs.idsdp.rdpprtapp.web.dto.DppDevelopmentPartnersDTO;
import com.ibcs.idsdp.rdpprtapp.web.dto.DppModeFinancingDTO;
import com.ibcs.idsdp.rdpprtapp.web.dto.response.GrandTotalResponse;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
@Data
public class RdppObjectiveCostResponse {

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
    private String concernedDivisionName;
    private LocalDate dateCommencement;
    private LocalDate dateCompletion;
    private LocalDate cumulativeDate;
    private Boolean timeExtension;
    private Boolean costExtension;
    private List<DppModeFinancingDTO> modeFinanceList;
    private List<DppCurrencyRateDTO> currencyRateList;
    private List<DppDevelopmentPartnersDTO> developmentPartnersList;
    private Boolean status;
    private Long dppMasterId;
    private String fsUuid;
    private String revisedVersion;

    private Long referenceId;
    private String referenceUuid;

    private List<GrandTotalResponse> grandTotal;

}
