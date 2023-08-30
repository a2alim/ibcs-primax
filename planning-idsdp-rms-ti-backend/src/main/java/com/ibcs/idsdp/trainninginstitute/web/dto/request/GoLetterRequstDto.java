package com.ibcs.idsdp.trainninginstitute.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;

import lombok.Data;

@Data
public class GoLetterRequstDto extends UuidIdHolderRequestBodyDTO {

	private String goCode;
	private Long partialFinalPaymentId;
	private Long fiscalYearId;
	private Double totalAmount;
	private Boolean isSend;
	private String subject;
	private String mailBody;
	private Long templateTypeId;
	private Long predefinedTemplateId;
	private String approvedStatus;
	private String enothiNumber;
	private String bnDate;
	private String enDate;

	private String fileDownloadUrl;
	private String bucketName;
	private String fileName;

}
