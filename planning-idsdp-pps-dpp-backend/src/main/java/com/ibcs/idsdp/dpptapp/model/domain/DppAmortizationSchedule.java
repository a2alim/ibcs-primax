package com.ibcs.idsdp.dpptapp.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.util.List;

@Data
@Entity
@Table(name = "dpp_amortization_schedule")
@EntityListeners(AuditingEntityListener.class)
public class DppAmortizationSchedule extends BaseEntity {


    @Column(name = "project_concept_uuid")
    private String projectConceptUuid;
    @Column(name = "project_concept_master_id")
    private Long projectConceptMasterId;
    @Column(name = "project_name")
    private String projectName;
    @Column(name = "total_investment")
    private Double totalInvestment;
    @Column(name = "loan_portion")
    private Long loanPortion;
    @Column(name = "loan_period")
    private Long loanPeriod;
    @Column(name = "rate_of_interest")
    private Long rateOfInterest;
    @Column(name = "grace_period")
    private Long gracePeriod;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "dpp_master_id")
    private DppObjectiveCost objectiveCost;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "amortization_schedule_id")
    List<DppAmortizationScheduleDetails> amortizationScheduleList;

}
