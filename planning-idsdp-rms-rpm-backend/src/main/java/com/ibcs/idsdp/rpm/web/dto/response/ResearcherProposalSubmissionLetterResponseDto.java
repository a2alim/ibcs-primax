package com.ibcs.idsdp.rpm.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
public class ResearcherProposalSubmissionLetterResponseDto extends UuidIdHolderRequestBodyDTO{

	private Long researcherProposalId;

	private String subject;

	private String letterBody;

	private Integer mailSend;

	private ResearcherProposalResponseDto researcherProposalDto;

}
