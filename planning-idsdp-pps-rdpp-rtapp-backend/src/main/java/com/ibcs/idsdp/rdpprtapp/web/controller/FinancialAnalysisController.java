package com.ibcs.idsdp.rdpprtapp.web.controller;

import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rdpprtapp.model.domain.FinancialAnalysis;
import com.ibcs.idsdp.rdpprtapp.services.FinancialAnalysisService;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.FinancialAnalysisRequest;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

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
}
