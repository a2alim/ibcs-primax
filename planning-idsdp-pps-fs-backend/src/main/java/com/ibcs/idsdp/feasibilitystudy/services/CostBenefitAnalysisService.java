package com.ibcs.idsdp.feasibilitystudy.services;

import com.ibcs.idsdp.feasibilitystudy.web.dto.CostBenefitAnalysisDTO;
import org.springframework.web.multipart.MultipartFile;

public interface CostBenefitAnalysisService {

    String createCostBenefitAnalysis(String financialAnalysis, Double financialNetPresentVal, Double financialBenefitCostRatio, Double financialInternalRateReturn, String economicAnalysis, Double economicNetPresentVal, Double economicBenefitCostRatio, Double economicInternalRateReturn, MultipartFile attachmentFile, Long fsrMasterId);

    CostBenefitAnalysisDTO getCostBenefitAnalysisList(Long fsrMasterId);

    String updateCostBenefitAnalysis(String financialAnalysis, Double financialNetPresentVal, Double financialBenefitCostRatio, Double financialInternalRateReturn, String economicAnalysis, Double economicNetPresentVal, Double economicBenefitCostRatio, Double economicInternalRateReturn, MultipartFile attachmentFile, Long fsrMasterId);
}
