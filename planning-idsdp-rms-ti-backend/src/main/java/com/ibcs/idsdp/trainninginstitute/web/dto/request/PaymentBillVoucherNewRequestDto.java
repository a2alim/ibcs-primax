package com.ibcs.idsdp.trainninginstitute.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;

import lombok.Data;

@Data
public class PaymentBillVoucherNewRequestDto extends UuidIdHolderRequestBodyDTO {

	private PartialFinalPaymentNewRequestDto partialFinalPaymentNewRequestDto;
	
	private Long partialFinalPaymentId;
	
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
