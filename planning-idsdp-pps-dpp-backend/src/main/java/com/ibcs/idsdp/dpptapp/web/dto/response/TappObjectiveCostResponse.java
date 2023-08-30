package com.ibcs.idsdp.dpptapp.web.dto.response;

import com.ibcs.idsdp.dpptapp.web.dto.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class TappObjectiveCostResponse {

    private Long id;
    private String uuid;
    private String projectTitleEn;
    private String projectTitleBn;
    private String ministryDivision;
    private String implementingAgency;
    private String objectivesTargets;
    private String designationContactPerson;
    private String responsiblePreparation;
    private String developmentPartner;
    private Long concernedDivisionId;
    private String projectConceptUuid;
    private Long projectConceptMasterId;
    private Boolean status;

    private LocalDate dateCommencement;
    private LocalDate dateCompletion;

    private LocalDate expCommencementDate;
    private LocalDate expCompletionDate;

    private TappModeFinancingDTO tappModeFinanceDTO;
    private List<DppModeFinancingDTO> modeFinanceList;
    private List<TappCurrencyRateDTO> tappCurrencyRateDTOS;
    public List<TappDevelopmentPartnersDTO> developmentPartnersList;
}
