package com.ibcs.idsdp.rdpprtapp.model.domain;


import com.ibcs.idsdp.common.model.domain.BaseEntity;
import com.ibcs.idsdp.rdpprtapp.enums.DppAnnualPhasing;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import javax.validation.constraints.NotNull;


@Entity
@Data
@Table(name = "rdpp_annual_phasing_cost")
@EntityListeners(AuditingEntityListener.class)
public class DppAnnualPhasingCost extends BaseEntity {

    @NotNull
    @Column(name = "project_concept_uuid")
    private String projectConceptUuid;

    @NotNull
    @Column(name = "rdpp_master_id")
    private Long rdppMasterId;

    @NotNull
    @Column(name = "project_concept_id")
    private Long projectConceptId;

    @NotNull
    @Column(name = "component_name")
    private DppAnnualPhasing componentName;

    @OneToOne
    @JoinColumn(name="rdpp_annual_phasing_cost_total_id", referencedColumnName = "id", unique = true)
    private DppAnnualPhasingCostTotal dppAnnualPhasingCostTotal;

//    @OneToMany(targetEntity = DppAnnualPhasingCostTabDetails.class,cascade=CascadeType.ALL, fetch = FetchType.EAGER)
//    @JoinColumn(name = "dpp_annual_phasing_cost_id", referencedColumnName = "id")
//    private List<DppAnnualPhasingCostTabDetails> dppAnnualPhasingCostTabDetails;


}
