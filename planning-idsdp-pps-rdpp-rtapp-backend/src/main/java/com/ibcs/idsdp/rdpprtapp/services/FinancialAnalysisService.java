package com.ibcs.idsdp.rdpprtapp.services;

import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.rdpprtapp.model.domain.FinancialAnalysis;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.FinancialAnalysisRequest;

public interface FinancialAnalysisService {

     FinancialAnalysis saveFinancialAnalysis(FinancialAnalysisRequest financialAnalysisRequest);

     FinancialAnalysis updateFinancialAnalysis(FinancialAnalysisRequest request, String pcUuid);

     ResponseWithResults getFinancialAnalysisByProjectId(String projectId);


}
