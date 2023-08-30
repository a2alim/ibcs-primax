package com.ibcs.idsdp.dpptapp.web.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.ibcs.idsdp.common.model.domain.Attachment;
import com.ibcs.idsdp.common.services.AttachmentUploadService;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.dpptapp.model.domain.FinancialAnalysis;
import com.ibcs.idsdp.dpptapp.services.FinancialAnalysisService;
import com.ibcs.idsdp.dpptapp.web.dto.request.FinancialAnalysisCalcultionRequest;
import com.ibcs.idsdp.dpptapp.web.dto.request.FinancialAnalysisRequest;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@AllArgsConstructor
@RestApiController
@RequestMapping("/project-details-partb")
public class FinancialAnalysisController {

    private final FinancialAnalysisService financialAnalysisService;

    // For Create Financial Analysis
    @PostMapping("/create-financial-analysis")
    public ResponseWithResults createFinancialAnalysis(@RequestBody FinancialAnalysisRequest financialAnalysisRequest){
        FinancialAnalysis financialAnalysis = financialAnalysisService.saveFinancialAnalysis(financialAnalysisRequest);
        if(financialAnalysis!=null) {
            return new ResponseWithResults(200, "", financialAnalysis);
        } else {
            return new ResponseWithResults(500, "", "");
        }
    }

    // For Update Financial Analysis
    @PutMapping("/update-financial-analysis/{projectId}")
    public ResponseWithResults updateFinancialAnalysis(@PathVariable("projectId") String uuid, @RequestBody FinancialAnalysisRequest financialAnalysisRequest){
        FinancialAnalysis financialAnalysis = financialAnalysisService.updateFinancialAnalysis(financialAnalysisRequest, uuid);
        if (financialAnalysis != null) {
            return new ResponseWithResults(200, "", financialAnalysis);
        } else {
            return new ResponseWithResults(500, "", "");
        }

    }

    // For get Financial Analysis by Project id
    @GetMapping("/getFinancialAnalysis/{projectId}")
    public ResponseWithResults getFinancialAnalysisByProjectId(@PathVariable("projectId") String uuid){
        return financialAnalysisService.getFinancialAnalysisByProjectId(uuid);
    }

    // For Create Financial Analysis calculation
    @PostMapping("/create-financial-analysis-calculation")
    public ResponseWithResults createFinancialAnalysisCalculation(@RequestBody FinancialAnalysisCalcultionRequest financialAnalysisCalRequest) {
        return financialAnalysisService.createFinancialAnalysisCalculation(financialAnalysisCalRequest);
    }

    // For get Financial Analysis calculation
    @GetMapping("/get-financial-analysis-calculation")
    public ResponseWithResults findByProjectConceptMasterIdAndCalculationType(@RequestParam Long projectConceptMasterId, String calculationType) {
        return financialAnalysisService.findByProjectConceptMasterIdAndCalculationType(projectConceptMasterId, calculationType);
    }
}
