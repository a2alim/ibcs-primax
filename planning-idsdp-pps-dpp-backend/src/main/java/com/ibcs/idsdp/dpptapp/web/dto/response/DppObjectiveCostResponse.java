package com.ibcs.idsdp.dpptapp.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.dpptapp.web.dto.DppCurrencyRateDTO;
import com.ibcs.idsdp.dpptapp.web.dto.DppDevelopmentPartnersDTO;
import com.ibcs.idsdp.dpptapp.web.dto.DppModeFinancingDTO;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class DppObjectiveCostResponse{

    private  String uuid;
    private Long id;
    private String projectConceptUuid;
    private Long paripatraVersionId;
    private String projectTitleEn;
    private String projectTitleBn;
    private String ministryDivision;
    private String implementingAgency;
    private String objectivesTargets;
    private Long concernedDivisionId;
    private LocalDate dateCommencement;
    private LocalDate dateCompletion;
    public List<DppModeFinancingDTO> modeFinanceList;
    public List<DppDevelopmentPartnersDTO> developmentPartnersList;
    public List<DppCurrencyRateDTO> currencyRateList;
}
