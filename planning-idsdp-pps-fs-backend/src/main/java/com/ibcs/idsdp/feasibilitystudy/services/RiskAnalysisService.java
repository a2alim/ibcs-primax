package com.ibcs.idsdp.feasibilitystudy.services;

import com.ibcs.idsdp.feasibilitystudy.web.dto.RiskAnalysisDTO;
import com.ibcs.idsdp.feasibilitystudy.web.dto.TechnicalAnalysisDTO;
import org.springframework.web.multipart.MultipartFile;

public interface RiskAnalysisService {

    String createRiskAnalysis(String envClimateChangeAnalysis, String assessmentDisasterResilienceProject, MultipartFile attachmentFile, Long fsrMasterId);

    RiskAnalysisDTO getRiskAnalysisList(Long fsrMasterId);

    String updateRiskAnalysis(String envClimateChangeAnalysis, String assessmentDisasterResilienceProject, MultipartFile attachmentFile, Long fsrMasterId);
}
