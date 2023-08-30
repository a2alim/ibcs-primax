package com.ibcs.idsdp.rdpprtapp.model.domain;


import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "rdpp_fiscal_year")
@EntityListeners(AuditingEntityListener.class)
public class DppFiscalYear extends BaseEntity {


    @ManyToOne
    @JoinColumn(name = "rdpp_annual_phasing_cost_tab_details_id")
    private DppAnnualPhasingCostTabDetails dppAnnualPhasingCostTabDetails;

    @NotNull
    private String fiscalYear;

    @NotNull
    private Double gobAmount;

    @NotNull
    private Double gobFeAmount;

    @NotNull
    private Double gobThruAmount;

    @NotNull
    private Double spAcAmount;

    @NotNull
    private Double thruPdAmount;

    @NotNull
    private Double thruDpAmount;

    @NotNull
    private Double ownFundAmount;

    @NotNull
    private Double ownFundFeAmount;

    @NotNull
    private Double otherAmount;

    @NotNull
    private Double otherFeAmount;

    @NotNull
    private Double totalAmount;

    @NotNull
    private Integer quantity;

    @OneToOne
    @JoinColumn(name="rdpp_annual_phasing_cost_total_id")
    private DppAnnualPhasingCostTotal dppAnnualPhasingCostTotal;

}
