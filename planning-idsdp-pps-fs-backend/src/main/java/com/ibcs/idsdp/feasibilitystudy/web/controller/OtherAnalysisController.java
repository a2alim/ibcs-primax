package com.ibcs.idsdp.feasibilitystudy.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.feasibilitystudy.constants.OtherAnalysisConstant;
import com.ibcs.idsdp.feasibilitystudy.model.domain.OtherAnalysis;
import com.ibcs.idsdp.feasibilitystudy.services.OtherAnalysisService;
import com.ibcs.idsdp.feasibilitystudy.web.dto.OtherAnalysisDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestApiController
@RequestMapping(OtherAnalysisConstant.OTHER_ANALYSIS)
public class OtherAnalysisController extends BaseController<OtherAnalysis, OtherAnalysisDTO> {

    private final OtherAnalysisService otherAnalysisService;

    public OtherAnalysisController(BaseService<OtherAnalysis, OtherAnalysisDTO> baseService, OtherAnalysisService otherAnalysisService) {
        super(baseService);
        this.otherAnalysisService = otherAnalysisService;
    }

    /**
     * For create other analysis
     * @param humanResourceAnalysis
     * @param institutionalAnalysis
     * @param riskSensitivityAnalysis
     * @param alternativesAnalysis
     * @param recommendationConclution
     * @param attachmentFile
     * @param projectConceptId
     */
    @PostMapping(path = "/createOtherAnalysis", produces = "application/json")
    ResponseEntity<String> create(@RequestParam String humanResourceAnalysis, String institutionalAnalysis, String riskSensitivityAnalysis, String alternativesAnalysis, String recommendationConclution, MultipartFile attachmentFile, Long fsrMasterId) {
        otherAnalysisService.createOtherAnalysis(humanResourceAnalysis, institutionalAnalysis, riskSensitivityAnalysis, alternativesAnalysis, recommendationConclution, attachmentFile, fsrMasterId);
        return new ResponseEntity<String>(HttpStatus.CREATED);
    }

    @GetMapping(path = "/getOtherAnalysisList/{fsrMasterId}", produces = "application/json")
    OtherAnalysisDTO getOtherAnalysisList(@PathVariable Long fsrMasterId) {
        OtherAnalysisDTO otherAnalysisDTO = otherAnalysisService.getOtherAnalysisList(fsrMasterId);
        return otherAnalysisDTO;
    }

    /**
     * For update other analysis
     * @param humanResourceAnalysis
     * @param institutionalAnalysis
     * @param riskSensitivityAnalysis
     * @param alternativesAnalysis
     * @param recommendationConclution
     * @param attachmentFile
     * @param projectConceptId
     */
    @PutMapping(path = "/updateOtherAnalysis", produces = "application/json")
    ResponseEntity<String> update(@RequestParam String humanResourceAnalysis, String institutionalAnalysis, String riskSensitivityAnalysis, String alternativesAnalysis, String recommendationConclution, MultipartFile attachmentFile, Long fsrMasterId) {
        otherAnalysisService.updateOtherAnalysis(humanResourceAnalysis, institutionalAnalysis, riskSensitivityAnalysis, alternativesAnalysis, recommendationConclution, attachmentFile, fsrMasterId);
        return new ResponseEntity<String>(HttpStatus.CREATED);
    }

}
