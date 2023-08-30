package com.ibcs.idsdp.dpptapp.model.domain;


import com.ibcs.idsdp.common.model.domain.BaseEntity;
import com.ibcs.idsdp.dpptapp.enums.DppAnnualPhasing;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import javax.validation.constraints.NotNull;


@Entity
@Data
@Table(name = "tapp_annual_phasing_cost")
@EntityListeners(AuditingEntityListener.class)
public class TappAnnualPhasingCost extends BaseEntity {

    @NotNull
    @Column(name = "project_concept_uuid")
    private String projectConceptUuid;

    @NotNull
    @Column(name = "project_concept_id")
    private Long projectConceptId;

    @NotNull
    @Column(name = "component_name")
    private DppAnnualPhasing componentName;

    @OneToOne
    @JoinColumn(name="tapp_annual_phasing_cost_total_id", referencedColumnName = "id", unique = true)
    private TappAnnualPhasingCostTotal tappAnnualPhasingCostTotal;

//    @OneToMany(targetEntity = DppAnnualPhasingCostTabDetails.class,cascade=CascadeType.ALL, fetch = FetchType.EAGER)
//    @JoinColumn(name = "dpp_annual_phasing_cost_id", referencedColumnName = "id")
//    private List<DppAnnualPhasingCostTabDetails> dppAnnualPhasingCostTabDetails;


}
