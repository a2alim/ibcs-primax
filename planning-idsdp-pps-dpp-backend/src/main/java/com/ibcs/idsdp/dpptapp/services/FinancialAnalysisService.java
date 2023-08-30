package com.ibcs.idsdp.dpptapp.services;

import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.dpptapp.model.domain.FinancialAnalysis;
import com.ibcs.idsdp.dpptapp.web.dto.request.FinancialAnalysisCalcultionRequest;
import com.ibcs.idsdp.dpptapp.web.dto.request.FinancialAnalysisRequest;

public interface FinancialAnalysisService {

     FinancialAnalysis saveFinancialAnalysis(FinancialAnalysisRequest financialAnalysisRequest);

     FinancialAnalysis updateFinancialAnalysis(FinancialAnalysisRequest request, String pcUuid);

     ResponseWithResults getFinancialAnalysisByProjectId(String projectId);

     ResponseWithResults createFinancialAnalysisCalculation(FinancialAnalysisCalcultionRequest financialAnalysisCalRequest);

     ResponseWithResults findByProjectConceptMasterIdAndCalculationType(Long projectConceptMasterId, String calculationType);

}
