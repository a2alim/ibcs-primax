package com.ibcs.idsdp.feasibilitystudy.services;

import com.ibcs.idsdp.feasibilitystudy.web.dto.OtherAnalysisDTO;
import org.springframework.web.multipart.MultipartFile;

public interface OtherAnalysisService {

    String createOtherAnalysis(String humanResourceAnalysis, String institutionalAnalysis, String riskSensitivityAnalysis, String alternativesAnalysis, String recommendationConclution, MultipartFile attachmentFile, Long fsrMasterId);

    OtherAnalysisDTO getOtherAnalysisList(Long fsrMasterId);

    String updateOtherAnalysis(String humanResourceAnalysis, String institutionalAnalysis, String riskSensitivityAnalysis, String alternativesAnalysis, String recommendationConclution, MultipartFile attachmentFile, Long fsrMasterId);
}
