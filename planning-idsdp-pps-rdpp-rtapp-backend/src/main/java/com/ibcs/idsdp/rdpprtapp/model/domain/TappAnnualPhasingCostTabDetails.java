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
@Table(name = "rtapp_annual_phasing_cost_tab_details")
@EntityListeners(AuditingEntityListener.class)
public class TappAnnualPhasingCostTabDetails extends BaseEntity {

    @ManyToOne
    @JoinColumn(name="rtapp_annual_phasing_cost_id")
    private TappAnnualPhasingCost tappAnnualPhasingCost;

    private Long attachmentId;

    private Long economicCodeId;

    private Long subEconomicCodeId;

    private String description;

    private Long unitId;

    private Double unitCost;

    private Double qty;

    private Double totalAmount;

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
    @Column(name="is_from_original", columnDefinition = "bool default false")
    private Boolean isFromOriginal;

//    @OneToMany(targetEntity = DppFiscalYear.class,cascade=CascadeType.ALL, fetch = FetchType.EAGER)
//    @JoinColumn(name = "dpp_annual_phasing_cost_tab_details_id", referencedColumnName = "id")
//    private List<DppFiscalYear> dppFiscalYears;
}
