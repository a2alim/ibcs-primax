package com.ibcs.idsdp.trainninginstitute.model.domain;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import com.ibcs.idsdp.common.model.domain.BaseEntity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@ToString
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "M3_PAYMENT_BILL_VOUCHER_NEW")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class PaymentBillVoucherNewModel extends BaseEntity {
	
	
	@NotNull
	@ManyToOne
	@JoinColumn(name = "m3_partial_final_payment_id")
	private PartialFinalPaymentNewModel partialFinalPayment;	
	
    @OneToOne(cascade = CascadeType.DETACH)
    @JoinColumn(name = "M3_TRAINING_BUDGET_ID")
    private TrainingBudgetModel trainingBudgetModel;

    private Integer expenditureAmount;

    private Integer vatAndTaxPercentage;

    private Integer vatAndTaxAmount;

    private Integer netPaymentAmount;

    private Integer voucherNumber;
    
    private String fileDownloadUrl;
	private String bucketName;
	private String fileName;

}
