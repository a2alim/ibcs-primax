package com.ibcs.idsdp.dpptapp.web.dto.response;

import com.ibcs.idsdp.dpptapp.model.domain.annexIII_aGoods.AnnexureGoodsDetails;
import com.ibcs.idsdp.dpptapp.model.domain.tappAnnexurs.TappAnnexureGoodsDetails;
import com.ibcs.idsdp.dpptapp.web.dto.*;
import com.ibcs.idsdp.dpptapp.web.dto.request.annexIII_aGoods.AnnexureGoodsDetailsRequest;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;


@Data
public class ProjectDetailInfoDTO {
    private String projectCode;
    private String projectName;
    private String projectNameBn;
    private String ministryCode;
    private String ministryName;
    private String agencyCode;
    private String agencyName;
    private String sectorDivisionCode;
    private String sectorDivisionName;
    private String adpSectorCode;
    private String adpSectorName;
    private String adpSubSectorCode;
    private String adpSubSectorName;
    private String approvalAuthorityName;
    private LocalDateTime dateOfApproval;
    private Date goIssueDate;
    private LocalDate dateOfCommencement;
    private LocalDate dateOfCompletion;
    private String projectType;
    private String projectDuration;
    private String projectObjectives;
    private DppAnnualPhasingCostTotalDTO revenue;
    private DppAnnualPhasingCostTotalDTO capital;
    private DppAnnualPhasingCostTotalDTO physicalContingency;
    private DppAnnualPhasingCostTotalDTO priceContingency;
    private List<ShortAnnualCostTotalWithFiscalYear> yearWiseRevenue;
    private List<ShortAnnualCostTotalWithFiscalYear> yearWiseCapital;
    private List<ShortAnnualCostTotalWithFiscalYear> yearWisePhysicalContingency;
    private List<ShortAnnualCostTotalWithFiscalYear> yearWisePriceContingency;
    private EstimatedCostTabDetailsDTO estimatedCostRevenue;
    private EstimatedCostTabDetailsDTO estimatedCostCapital;
    private EstimatedCostTabDetailsDTO estimatedCostPhysicalContingency;
    private EstimatedCostTabDetailsDTO estimatedCostPriceContingency;
    private ShortFinancialAnalysisDTO financialAnalysis;
    private List<DppModeFinancingDTO> modeFinanceList;
    private TappModeFinancingDTO tappModeFinance;
    private List<DppAnnualCostTotalWithFiscalYear> yearWiseCost;
    private List<AnnexureGoodsDetailsRequest> procurementPlanGoods;
    private List<AnnexureGoodsDetailsRequest> procurementPlanWorks;
    private List<AnnexureGoodsDetailsRequest> procurementPlanService;
    private List<TappAnnexureGoodsDetailDTO> procurementPlanTappGoods;
    private List<TappAnnexureGoodsDetailDTO> procurementPlanTappService;
    private List<DppLocationWiseBreakdownDTO> locationWiseCost;
}
