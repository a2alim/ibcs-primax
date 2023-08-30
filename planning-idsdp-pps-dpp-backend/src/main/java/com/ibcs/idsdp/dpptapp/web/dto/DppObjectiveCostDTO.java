package com.ibcs.idsdp.dpptapp.web.dto;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

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
    private Long sectorId;
    private Long subSectorId;
   // private String developmentPartnerId;
    private LocalDate dateCommencement;
    private LocalDate dateCompletion;
    private List<DppModeFinancingDTO> modeFinanceList;
    private List<DppCurrencyRateDTO> currencyRateList;
    private List<DppDevelopmentPartnersDTO> developmentPartnersList;
    private Boolean status;
    private Long dppMasterId;
    private String fsUuid;
    private Long fsAttachmentId;
    private String fsAttachmentName;
    private String ppsCode;
    private String amsCode;
    private String financeCode;
}
