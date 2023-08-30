package com.ibcs.idsdp.dpptapp.web.dto.response;

import com.ibcs.idsdp.dpptapp.web.dto.AnnualPhasingCostTotalDTO;
import com.ibcs.idsdp.dpptapp.web.dto.ShortFinancialAnalysisDTO;
import com.ibcs.idsdp.dpptapp.web.dto.ShortLocationWiseBreakdownDTO;
import com.ibcs.idsdp.dpptapp.web.dto.ShortModeFinancingDTO;
import com.ibcs.idsdp.dpptapp.web.dto.request.annexIII_aGoods.ProcurementPlanDetails;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;


@Data
public class SpimsApprovedProjectDetailInfoDTO {
    private String ppsCode;
    private String projectName;
    private String projectNameBn;
    private String ministryCode;
    private String agencyCode;
    private String adpSectorCode;
    private String adpSubSectorCode;
//    private String approvalAuthority;
//    private LocalDate dateOfApproval;
//    private LocalDate adminGoDate;
    private LocalDate dateOfCommencement;
    private LocalDate dateOfCompletion;
    private String projectType;
    private String projectObjectives;

    private String environmentalImpactWiseCategory; //dpp part b 26.1
    private String environmentalSustainability; //dpp part b 25.2
    private String landRequired;
    private String specificLinkage; //dpp part b 27
    private String povertySituation; //dpp part b 14.3
    private String womenDevelopmentImpact; //dpp part b 25.4
    private String disasterManagement; //dpp part b 25.3

    private AnnualPhasingCostTotalDTO revenue;
    private AnnualPhasingCostTotalDTO capital;
    private AnnualPhasingCostTotalDTO physicalContingency;
    private AnnualPhasingCostTotalDTO priceContingency;
    private List<AnnualCostTotalWithFiscalYear> yearWiseEstimatedCost;
    private ComponentWiseCostDTO componentWiseCost;
    private ShortFinancialAnalysisDTO financialAnalysis;
    private List<ShortModeFinancingDTO> modeOfFinance;
    private List<YearWiseComponentWiseCostDTO> yearWiseComponentWiseCost;

    private List<ProcurementPlanDetails> procurementPlanGoods;
    private List<ProcurementPlanDetails> procurementPlanWorks;
    private List<ProcurementPlanDetails> procurementPlanService;
    private List<ShortLocationWiseBreakdownDTO> locationWiseCost;
}
