package com.ibcs.idsdp.feasibilitystudy.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.feasibilitystudy.constants.CostBenefitAnalysisConstant;
import com.ibcs.idsdp.feasibilitystudy.model.domain.CostBenefitAnalysis;
import com.ibcs.idsdp.feasibilitystudy.services.CostBenefitAnalysisService;
import com.ibcs.idsdp.feasibilitystudy.web.dto.CostBenefitAnalysisDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestApiController
@RequestMapping(CostBenefitAnalysisConstant.COST_BENEFIT_ANALYSIS)
public class CostBenefitAnalysisController extends BaseController<CostBenefitAnalysis, CostBenefitAnalysisDTO> {

    private final CostBenefitAnalysisService costBenefitAnalysisService;

    public CostBenefitAnalysisController(BaseService<CostBenefitAnalysis, CostBenefitAnalysisDTO> baseService, CostBenefitAnalysisService costBenefitAnalysisService) {
        super(baseService);
        this.costBenefitAnalysisService = costBenefitAnalysisService;
    }

    /**
     * For create cost benefit analysis
     * @param financialAnalysis
     * @param financialNetPresentVal
     * @param financialBenefitCostRatio
     * @param financialInternalRateReturn
     * @param economicAnalysis
     * @param economicNetPresentVal
     * @param economicBenefitCostRatio
     * @param economicInternalRateReturn
     * @param attachmentFile
     * @param projectConceptId
     */
    @PostMapping(path = "/createCostBenefitAnalysis", produces = "application/json")
    ResponseEntity<String> create(@RequestParam String financialAnalysis, Double financialNetPresentVal, Double financialBenefitCostRatio, Double financialInternalRateReturn, String economicAnalysis, Double economicNetPresentVal, Double economicBenefitCostRatio, Double economicInternalRateReturn, MultipartFile attachmentFile, Long fsrMasterId) {
        costBenefitAnalysisService.createCostBenefitAnalysis(financialAnalysis, financialNetPresentVal, financialBenefitCostRatio, financialInternalRateReturn, economicAnalysis, economicNetPresentVal, economicBenefitCostRatio, economicInternalRateReturn, attachmentFile, fsrMasterId);
        return new ResponseEntity<String>(HttpStatus.CREATED);
    }

    @GetMapping(path = "/getCostBenefitAnalysisList/{fsrMasterId}", produces = "application/json")
    CostBenefitAnalysisDTO getCostBenefitAnalysisList(@PathVariable Long fsrMasterId) {
        CostBenefitAnalysisDTO costBenefitAnalysisDTO = costBenefitAnalysisService.getCostBenefitAnalysisList(fsrMasterId);
        return costBenefitAnalysisDTO;
    }

    /**
     * For update cost benefit analysis
     * @param financialAnalysis
     * @param financialNetPresentVal
     * @param financialBenefitCostRatio
     * @param financialInternalRateReturn
     * @param economicAnalysis
     * @param economicNetPresentVal
     * @param economicBenefitCostRatio
     * @param economicInternalRateReturn
     * @param attachmentFile
     * @param projectConceptId
     */
    @PutMapping(path = "/updateCostBenefitAnalysis", produces = "application/json")
    ResponseEntity<String> update(@RequestParam String financialAnalysis, Double financialNetPresentVal, Double financialBenefitCostRatio, Double financialInternalRateReturn, String economicAnalysis, Double economicNetPresentVal, Double economicBenefitCostRatio, Double economicInternalRateReturn, MultipartFile attachmentFile, Long fsrMasterId) {
        costBenefitAnalysisService.updateCostBenefitAnalysis(financialAnalysis, financialNetPresentVal, financialBenefitCostRatio, financialInternalRateReturn, economicAnalysis, economicNetPresentVal, economicBenefitCostRatio, economicInternalRateReturn, attachmentFile, fsrMasterId);
        return new ResponseEntity<String>(HttpStatus.CREATED);
    }
}
