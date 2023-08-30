package com.ibcs.idsdp.rdpprtapp.web.dto.response.dashboard;

import com.ibcs.idsdp.rdpprtapp.web.dto.dashboardDTO.DashboardPcDTO;
import lombok.Data;

import java.time.LocalDate;

@Data
public class DashboardResponse {

    private  String uuid;
    //private Long id;
    private Long paripatraVersionId;
    private String projectTitleEn;
    private String projectTitleBn;
    private String ministryDivision;
    private String implementingAgency;
    private String objectivesTargets;
    private String concernedDivisionId;
    private LocalDate dateCommencement;
    private LocalDate dateCompletion;
    private Boolean status;
    DashboardPcDTO dashboard_PcDTO;

//    public List<DppModeFinancingDTO> modeFinanceList;
//    public List<DppDevelopmentPartnersDTO> developmentPartnersList;
//    public List<DppCurrencyRateDTO> currencyRateList;
}
