package com.ibcs.idsdp.trainninginstitute.web.dto.response;

import java.time.LocalDate;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.trainninginstitute.enums.Status;
import com.ibcs.idsdp.trainninginstitute.model.domain.GoLetter;
import com.ibcs.idsdp.trainninginstitute.model.domain.ProposalModel;
import com.ibcs.idsdp.trainninginstitute.model.domain.TrainingInstituteProfileModel;

import lombok.Data;

@Data
public class PartialFinalPaymentNewResponseDto extends UuidIdHolderRequestBodyDTO {

	private String letterText;

	private String installmentType;

	private LocalDate installmentDate;

	private Integer installmentAmount;

	private String chalanNo;
	
	private Status status;   

	private Long fiscalYearId;

	private Long proposalId;

	private String memorandumNo;

	private LocalDate sendingDate;

	private String sourceNo;

	private LocalDate sourceDate;
	
	private TrainingInstituteProfileModel trainingInstituteProfileModel;
	
	private ProposalModel proposalModel;
	
	private GoLetter goLetter;

}
