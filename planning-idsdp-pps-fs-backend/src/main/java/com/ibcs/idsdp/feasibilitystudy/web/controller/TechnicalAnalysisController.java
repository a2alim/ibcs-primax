package com.ibcs.idsdp.feasibilitystudy.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.feasibilitystudy.constants.TechnicalAnalysisConstant;
import com.ibcs.idsdp.feasibilitystudy.model.domain.TechnicalAnalysis;
import com.ibcs.idsdp.feasibilitystudy.services.TechnicalAnalysisService;
import com.ibcs.idsdp.feasibilitystudy.web.dto.TechnicalAnalysisDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestApiController
@RequestMapping(TechnicalAnalysisConstant.TECHNICAL_ANALYSIS)
public class TechnicalAnalysisController extends BaseController<TechnicalAnalysis, TechnicalAnalysisDTO> {

    private final TechnicalAnalysisService technicalAnalysisService;

    public TechnicalAnalysisController(BaseService<TechnicalAnalysis, TechnicalAnalysisDTO> baseService, TechnicalAnalysisService technicalAnalysisService) {
        super(baseService);
        this.technicalAnalysisService = technicalAnalysisService;
    }

    /**
     * For create technical analysis
     * @param location
     * @param technicalDesign
     * @param outputPlan
     * @param costEstimates
     * @param impTimeline
     * @param attachmentFile
     * @param projectConceptId
     */
    @PostMapping(path = "/createTechnicalAnalysis", produces = "application/json")
    ResponseEntity<String> create(@RequestParam String location, String technicalDesign, String outputPlan, String costEstimates, String impTimeline, MultipartFile attachmentFile, Long fsrMasterId) {
        technicalAnalysisService.createTechnicalAnalysis(location, technicalDesign, outputPlan, costEstimates, impTimeline, attachmentFile, fsrMasterId);
        return new ResponseEntity<String>(HttpStatus.CREATED);
    }

    @GetMapping(path = "/getTechnicalAnalysisList/{fsrMasterId}", produces = "application/json")
    TechnicalAnalysisDTO getTechnicalAnalysisList(@PathVariable Long fsrMasterId) {
        TechnicalAnalysisDTO technicalAnalysisDTO = technicalAnalysisService.getTechnicalAnalysisList(fsrMasterId);
        return technicalAnalysisDTO;
    }

    /**
     * For update technical analysis
     * @param location
     * @param technicalDesign
     * @param outputPlan
     * @param costEstimates
     * @param impTimeline
     * @param attachmentFile
     * @param projectConceptId
     */
    @PutMapping(path = "/updateTechnicalAnalysis", produces = "application/json")
    ResponseEntity<String> update(@RequestParam String location, String technicalDesign, String outputPlan, String costEstimates, String impTimeline, MultipartFile attachmentFile, Long fsrMasterId) {
        technicalAnalysisService.updateTechnicalAnalysis(location, technicalDesign, outputPlan, costEstimates, impTimeline, attachmentFile, fsrMasterId);
        return new ResponseEntity<String>(HttpStatus.CREATED);
    }
}
