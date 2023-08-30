package com.ibcs.idsdp.rpm.web.dto.response;

import java.time.LocalDate;
import java.util.List;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;

import lombok.Data;

@Data
public class ReceivedBankChequeResponseDto extends UuidIdHolderRequestBodyDTO{

	private Long researcherProposalId;
	private Long installmentProcessId;
	private Long createGoLetterId;
	private Long installmentTypeId;
	private Long fiscalYearId;
	private Long researchCatTypeId;
	private Long templateTypeId;
	private Long predefinedTemplate;
	private Double totalAmount;
	private Double grantAmount;
	private Double receivedAmount;
	private String chequeNumber;
	private LocalDate chequeDate;
	private String tokenNo;
	private String subject;
	private String mailBody;
	private Boolean isSend;
	private Boolean status;
	private String receivedStatus;

	private CreateGOLetterResponseDto createGOLetter;
	private List<ReceivedBankChequeUploadDocResponseDto> receivedBankChequeUploadDoc;
}
