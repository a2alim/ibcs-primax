package com.ibcs.idsdp.trainninginstitute.model.repositories;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.trainninginstitute.model.domain.PartialFinalPaymentNewModel;
import com.ibcs.idsdp.trainninginstitute.model.domain.PaymentBillVoucherNewModel;

@Repository
public interface PaymentBillVoucherNewRepository extends ServiceRepository<PaymentBillVoucherNewModel> {	
	
	List<PaymentBillVoucherNewModel> findAllByPartialFinalPaymentAndIsDeleted(PartialFinalPaymentNewModel partialFinalPayment, Boolean isDeleted );
	
	
	
}
