package com.ibcs.idsdp.dpptapp.web.dto.request;

import com.ibcs.idsdp.dpptapp.web.dto.FinancialAnalysisCalculationDetailsDto;
import lombok.Data;

import java.util.List;

@Data
public class FinancialAnalysisCalcultionResponse {

    private String uuid;
    private Long projectConceptMasterId;
    private Double projectLifeTime;
    private Double discFac1;
    private Double discFac2;
    private Double discFac1Npv;
    private Double discFac1Bcr;
    private Double discFac1Irr;
    private Double discFac2Npv;
    private Double discFac2Bcr;
    private Double discFac2Irr;
    private Boolean isSelectDiscFactor1;
    private Boolean isSelectDiscFactor2;
    private String calculationType;

    private List<FinancialAnalysisCalculationDetailsDto> financialAnalysisList;
}
