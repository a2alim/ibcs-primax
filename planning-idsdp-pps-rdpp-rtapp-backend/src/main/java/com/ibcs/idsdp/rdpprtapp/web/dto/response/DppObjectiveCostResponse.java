package com.ibcs.idsdp.rdpprtapp.web.dto.response;

import com.ibcs.idsdp.rdpprtapp.web.dto.DppCurrencyRateDTO;
import com.ibcs.idsdp.rdpprtapp.web.dto.DppDevelopmentPartnersDTO;
import com.ibcs.idsdp.rdpprtapp.web.dto.DppModeFinancingDTO;
import lombok.Data;

import javax.persistence.Column;
import java.time.LocalDate;
import java.util.List;

@Data
public class DppObjectiveCostResponse{

    private  String uuid;
    private Long id;
    private Long paripatraVersionId;
    private String projectConceptUuid;
    private Long projectConceptMasterId;
    private Boolean timeExtension;
    private Boolean costExtension;
    private String projectTitleEn;
    private String projectTitleBn;
    private String ministryDivision;
    private String implementingAgency;
    private String objectivesTargets;
    private Long concernedDivisionId;
    private LocalDate dateCommencement;
    private LocalDate dateCompletion;
    private Long referenceId;
    private String referenceUuid;
    private String revisedVersion;
    private String revisedVersionBn;
    private LocalDate cumulativeDate;
    public List<DppModeFinancingDTO> modeFinanceList;
    public List<DppDevelopmentPartnersDTO> developmentPartnersList;
    public List<DppCurrencyRateDTO> currencyRateList;
    public List<DppObjectiveCostDates> objCostDates;
}
