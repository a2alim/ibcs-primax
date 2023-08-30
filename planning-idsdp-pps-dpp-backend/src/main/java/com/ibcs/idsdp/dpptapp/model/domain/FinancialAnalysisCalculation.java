package com.ibcs.idsdp.dpptapp.model.domain;


import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;

import javax.persistence.*;
import java.util.List;

@Data
@Entity
@Table(name = "financial_analysis_calculation")
public class FinancialAnalysisCalculation extends BaseEntity {

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

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "financialAnalysisCalculation")
    private List<FinancialAnalysisCalculationDetails> financialAnalysisList;

}
