package com.ibcs.idsdp.trainninginstitute.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.trainninginstitute.model.domain.TrainingBudgetModel;

import lombok.Data;

@Data
public class PaymentBillVoucherNewResponseDto extends UuidIdHolderRequestBodyDTO{
	
	
    private PartialFinalPaymentNewResponseDto partialFinalPaymentNewRequestDto;
    
    private TrainingBudgetModel trainingBudgetModel;
	
	private Long trainingBudgetId;

	private Integer expenditureAmount;

	private Integer vatAndTaxPercentage;

	private Integer vatAndTaxAmount;

	private Integer netPaymentAmount;

	private Integer voucherNumber;
	
	private String fileDownloadUrl;
	private String bucketName;
	private String fileName;

}
