package com.ibcs.idsdp.dpptapp.web.dto;

import lombok.Data;

@Data
public class ShortFinancialAnalysisDTO {
    private Double financialNpv;
    private Double economicNpv;
    private Double financialBcr;
    private Double economicBcr;
    private Double financialIrr;
    private Double economicIrr;
}
