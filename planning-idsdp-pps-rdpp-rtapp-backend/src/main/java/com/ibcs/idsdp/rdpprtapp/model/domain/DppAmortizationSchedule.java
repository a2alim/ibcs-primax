package com.ibcs.idsdp.rdpprtapp.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.util.List;

@Data
@Entity
@Table(name = "rdpp_amortization_schedule")
@EntityListeners(AuditingEntityListener.class)
public class DppAmortizationSchedule extends BaseEntity {



    @Column(name = "rdpp_master_id")
    private Long rdppMasterId;;
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



    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "rdpp_amortization_schedule_details")
    List<DppAmortizationScheduleDetails> amortizationScheduleList;

}
