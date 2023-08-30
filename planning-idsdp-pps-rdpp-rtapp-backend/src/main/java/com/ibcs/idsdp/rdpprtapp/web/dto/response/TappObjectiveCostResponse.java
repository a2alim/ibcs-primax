package com.ibcs.idsdp.rdpprtapp.web.dto.response;

import com.ibcs.idsdp.rdpprtapp.web.dto.*;
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

    private LocalDate cumulativeDate;
    private String revisedVersion;
    private Boolean timeExtension;
    private Boolean costExtension;

    private Long referenceId;
    private String referenceUuid;

    private TappModeFinancingDTO tappModeFinanceDTO;
    private List<TappCurrencyRateDTO> tappCurrencyRateDTOS;
    public List<TappDevelopmentPartnersDTO> developmentPartnersList;
    public List<DppObjectiveCostDates> objCostDates;
}
