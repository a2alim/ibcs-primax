package com.ibcs.idsdp.feasibilitystudy.services;

import com.ibcs.idsdp.feasibilitystudy.web.dto.TechnicalAnalysisDTO;
import org.springframework.web.multipart.MultipartFile;

public interface TechnicalAnalysisService {

    String createTechnicalAnalysis(String location, String technicalDesign, String outputPlan, String costEstimates, String impTimeline, MultipartFile attachmentFile, Long fsrMasterId);

    TechnicalAnalysisDTO getTechnicalAnalysisList(Long fsrMasterId);

    String updateTechnicalAnalysis(String location, String technicalDesign, String outputPlan, String costEstimates, String impTimeline, MultipartFile attachmentFile, Long fsrMasterId);
}
