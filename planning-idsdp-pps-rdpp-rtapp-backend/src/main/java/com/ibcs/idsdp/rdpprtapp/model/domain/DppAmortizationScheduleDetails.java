package com.ibcs.idsdp.rdpprtapp.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

@Data
@Entity
@Table(name = "rdpp_amortization_schedule_details")
@EntityListeners(AuditingEntityListener.class)
public class DppAmortizationScheduleDetails extends BaseEntity {


    @Column(name = "year")
    private Long year;
    @Column(name = "begining_principal_amount")
    private Double beginingPrincipalAmount;
    @Column(name = "yearly_fixed_amount")
    private Double yearlyFixedAmount;
    @Column(name = "yearly_interest_paid")
    private Double yearlyInterestPaid;
    @Column(name = "total_payment")
    private Double totalPayment;
    @Column(name = "ending_principal_balance")
    private Double endingPrincipalBalance;
    @Column(name = "types")
    private String types;
    @Column(name = "project_concept_master_id")
    private Long projectConceptMasterId;
}
