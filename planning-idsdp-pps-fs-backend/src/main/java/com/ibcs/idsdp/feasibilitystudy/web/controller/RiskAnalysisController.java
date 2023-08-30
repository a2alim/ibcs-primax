package com.ibcs.idsdp.feasibilitystudy.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.feasibilitystudy.constants.RiskAnalysisConstant;
import com.ibcs.idsdp.feasibilitystudy.model.domain.RiskAnalysis;
import com.ibcs.idsdp.feasibilitystudy.services.RiskAnalysisService;
import com.ibcs.idsdp.feasibilitystudy.web.dto.RiskAnalysisDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestApiController
@RequestMapping(RiskAnalysisConstant.RISK_ANALYSIS)
public class RiskAnalysisController extends BaseController<RiskAnalysis, RiskAnalysisDTO> {

    private final RiskAnalysisService riskAnalysisService;

    public RiskAnalysisController(BaseService<RiskAnalysis, RiskAnalysisDTO> baseService, RiskAnalysisService riskAnalysisService) {
        super(baseService);
        this.riskAnalysisService = riskAnalysisService;
    }

    /**
     * For create risk analysis
     * @param envClimateChangeAnalysis
     * @param assessmentDisasterResilienceProject
     * @param attachmentFile
     */
    @PostMapping(path = "/createRiskAnalysis", produces = "application/json")
    ResponseEntity<String> create(@RequestParam String envClimateChangeAnalysis, String assessmentDisasterResilienceProject, MultipartFile attachmentFile, Long fsrMasterId) {
        riskAnalysisService.createRiskAnalysis(envClimateChangeAnalysis, assessmentDisasterResilienceProject, attachmentFile, fsrMasterId);
        return new ResponseEntity<String>(HttpStatus.CREATED);
    }

    @GetMapping(path = "/getRiskAnalysisList/{fsrMasterId}", produces = "application/json")
    RiskAnalysisDTO getRiskAnalysisList(@PathVariable Long fsrMasterId) {
        RiskAnalysisDTO riskAnalysisDTO = riskAnalysisService.getRiskAnalysisList(fsrMasterId);
        return riskAnalysisDTO;
    }

    /**
     * For update risk analysis
     * @param envClimateChangeAnalysis
     * @param assessmentDisasterResilienceProject
     * @param attachmentFile
     * @param projectConceptId
     */
    @PutMapping(path = "/updateRiskAnalysis", produces = "application/json")
    ResponseEntity<String> update(@RequestParam String envClimateChangeAnalysis, String assessmentDisasterResilienceProject, MultipartFile attachmentFile, Long fsrMasterId) {
        riskAnalysisService.updateRiskAnalysis(envClimateChangeAnalysis, assessmentDisasterResilienceProject, attachmentFile, fsrMasterId);
        return new ResponseEntity<String>(HttpStatus.CREATED);
    }

}
