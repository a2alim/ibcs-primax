package com.ibcs.idsdp.dpptapp.web.dto;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Data
public class TappObjectiveCostDTO extends UuidIdHolderRequestBodyDTO {

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
    private Long sectorId;
    private Long subSectorId;
    //private String developmentPartnerId;
    private LocalDate dateCommencement;
    private LocalDate dateCompletion;
    private String projectConceptUuid;
    private Long projectConceptMasterId;
    private Long tappMasterId;

    private List<DppCurrencyRateDTO> currencyRateList;
    private Boolean status;

    private List<TappDevelopmentPartnersDTO> devPartnerlist;
    private List<DppModeFinancingDTO> modeFinanceList;

    //For Mode of financing
    private Long modId;
    private String modeUuid;

    private Double gobEA;
    private Double gobLocal;
    private Double gobFe;
    private Double gobTotal;
    private String gobSource;

    private Double developmentEA;
    private Double developmentLocal;
    private Double developmentFe;
    private Double developmentTotal;
    private String developmentSource;

    private Double ownFundEA;
    private Double ownFundLocal;
    private Double ownFundFe;
    private Double ownFundTotal;
    private String ownFundSource;

    private Double othersSpecifyEA;
    private Double othersSpecifyLocal;
    private Double othersSpecifyFe;
    private Double othersSpecifyTotal;
    private String othersSpecifySource;

    private Double grandTotalEa;
    private Double grandTotalLocal;
    private Double grandTotalFe;
    private Double grandTotalTotal;

    private String ppsCode;
    private String amsCode;
    private String financeCode;
}
