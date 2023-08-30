package com.ibcs.idsdp.dpptapp.web.dto.response;

import com.ibcs.idsdp.dpptapp.web.dto.*;
import lombok.Data;

import java.util.List;


@Data
public class ProjectInfoDetailDTO {
    private String projectNameEn;
    private String projectNameBn;
    private String objective;
    private String implementationPeriod;
    private String projectType;
    private String sector;
    private String subSector;
    private boolean isPaFunded;
    private boolean isOwnFunded;
    private ShortAnnualPhasingCostTotalDTO estimatedCost;
    private List<ShortAnnualCostTotalWithFiscalYear> yearWiseEstimatedCost;
    private ShortDetailsEstimatedCostResponse itemWiseCost;
    private ShortFinancialAnalysisDTO financialAnalysis;
    private DppLocationResponse location;
    private String movementStatus;
}
