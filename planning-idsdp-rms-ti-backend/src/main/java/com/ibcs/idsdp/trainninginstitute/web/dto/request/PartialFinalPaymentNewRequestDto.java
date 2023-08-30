package com.ibcs.idsdp.trainninginstitute.web.dto.request;

import java.time.LocalDate;
import java.util.List;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.trainninginstitute.enums.Status;

import lombok.Data;

@Data
public class PartialFinalPaymentNewRequestDto extends UuidIdHolderRequestBodyDTO {

	private String letterText;

	private String installmentType;

	private LocalDate installmentDate;

	private Integer installmentAmount;

	private String chalanNo;	

	private Long fiscalYearId;

	private Long proposalId;

	private String memorandumNo;
	
	private LocalDate sendingDate;
	
	private String sourceNo;
	
	private LocalDate sourceDate;
	
	private Status status;

}
