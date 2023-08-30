package com.ibcs.idsdp.feasibilitystudy.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.feasibilitystudy.constants.MarketAnalysisConstant;
import com.ibcs.idsdp.feasibilitystudy.model.domain.MarketAnalysis;
import com.ibcs.idsdp.feasibilitystudy.services.MarketAnalysisService;
import com.ibcs.idsdp.feasibilitystudy.web.dto.MarketAnalysisDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestApiController
@RequestMapping(MarketAnalysisConstant.MARKET_ANALYSIS)
public class MarketAnalysisController extends BaseController<MarketAnalysis, MarketAnalysisDTO> {

    private final MarketAnalysisService marketAnalysisService;

    public MarketAnalysisController(BaseService<MarketAnalysis, MarketAnalysisDTO> baseService, MarketAnalysisService marketAnalysisService) {
        super(baseService);
        this.marketAnalysisService = marketAnalysisService;
    }

    /**
     * For create market analysis
     * @param prbStatement
     * @param relevanceProjectIdea
     * @param proposedProjectInterventions
     * @param stakeholders
     * @param currentDemand
     * @param futureDemand
     * @param variousDemand
     * @param swotAnalysis
     * @param attachmentFile
     * @param projectConceptId
     */
    @PostMapping(path = "/createMarketAnalysis", produces = "application/json")
    ResponseEntity<String> create(@RequestParam String prbStatement, String relevanceProjectIdea, String proposedProjectInterventions, String stakeholders, String currentDemand, String futureDemand, String variousDemand, String swotAnalysis, MultipartFile attachmentFile, Long fsrMasterId) {
        marketAnalysisService.createMarketAnalysis(prbStatement, relevanceProjectIdea, proposedProjectInterventions, stakeholders, currentDemand, futureDemand, variousDemand, swotAnalysis, attachmentFile, fsrMasterId);
        return new ResponseEntity<String>(HttpStatus.CREATED);
    }

    @GetMapping(path = "/getMarketAnalysisList/{fsrMasterId}", produces = "application/json")
    MarketAnalysisDTO getMarketAnalysisList(@PathVariable Long fsrMasterId) {
        MarketAnalysisDTO marketAnalysisDTO = marketAnalysisService.getMarketAnalysisList(fsrMasterId);
        return marketAnalysisDTO;
    }

    /**
     * For update market analysis
     * @param prbStatement
     * @param relevanceProjectIdea
     * @param proposedProjectInterventions
     * @param stakeholders
     * @param currentDemand
     * @param futureDemand
     * @param variousDemand
     * @param swotAnalysis
     * @param attachmentFile
     * @param projectConceptId
     */
    @PutMapping(path = "/updateMarketAnalysis", produces = "application/json")
    ResponseEntity<String> update(@RequestParam String prbStatement, String relevanceProjectIdea, String proposedProjectInterventions, String stakeholders, String currentDemand, String futureDemand, String variousDemand, String swotAnalysis, MultipartFile attachmentFile, Long fsrMasterId) {
        marketAnalysisService.updateMarketAnalysis(prbStatement, relevanceProjectIdea, proposedProjectInterventions, stakeholders, currentDemand, futureDemand, variousDemand, swotAnalysis, attachmentFile, fsrMasterId);
        return new ResponseEntity<String>(HttpStatus.CREATED);
    }


}
