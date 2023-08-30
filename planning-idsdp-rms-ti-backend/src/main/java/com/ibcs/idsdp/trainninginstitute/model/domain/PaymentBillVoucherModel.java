package com.ibcs.idsdp.trainninginstitute.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

@ToString
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "M3_PAYMENT_BILL_VOUCHER")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class PaymentBillVoucherModel extends BaseEntity {

    @OneToOne(cascade = CascadeType.DETACH)
    @JoinColumn(name = "M3_TRAINING_BUDGET_ID")
    private TrainingBudgetModel trainingBudgetModel;

    private Integer expenditureAmount;

    private Integer vatAndTaxPercentage;

    private Integer vatAndTaxAmount;

    private Integer netPaymentAmount;

    private Integer voucherNumber;

}
