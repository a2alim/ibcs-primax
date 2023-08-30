package com.ibcs.idsdp.feasibilitystudy.services;

import com.ibcs.idsdp.feasibilitystudy.web.dto.MarketAnalysisDTO;
import org.springframework.web.multipart.MultipartFile;

public interface MarketAnalysisService {

   String createMarketAnalysis(String prbStatement, String relevanceProjectIdea, String proposedProjectInterventions, String stakeholders, String currentDemand, String futureDemand, String variousDemand, String swotAnalysis, MultipartFile attachmentFile, Long fsrMasterId);

   MarketAnalysisDTO getMarketAnalysisList(Long fsrMasterId);

   String updateMarketAnalysis(String prbStatement, String relevanceProjectIdea, String proposedProjectInterventions, String stakeholders, String currentDemand, String futureDemand, String variousDemand, String swotAnalysis, MultipartFile attachmentFile, Long fsrMasterId);
}
