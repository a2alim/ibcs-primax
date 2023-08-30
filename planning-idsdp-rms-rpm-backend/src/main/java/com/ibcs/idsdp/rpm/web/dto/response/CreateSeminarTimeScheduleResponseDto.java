package com.ibcs.idsdp.rpm.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.rpm.client.dto.response.UserResponse;
import com.ibcs.idsdp.rpm.model.domain.CreateSeminar;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposal;
import lombok.Data;

/**
 * @author rakibul.hasan
 * @create 11/10/2021
 * @github `https://github.com/rhmtechno`
 */
@Data
public class CreateSeminarTimeScheduleResponseDto extends UuidIdHolderRequestBodyDTO {

	private CreateSeminar m2CreateSeminarId;
	private String startTime;
	private String positionInSeminar;
	private ResearcherProposal m1ResearcherProposalId;
	private String scheduleName;
	private Long concernedPersonUserId;
	private ResearcherProposalResponseDto researcherProposalDto;
	private String reviewTime;
	private String mobile;  
    private String emailAddress;
    private String designation;
    private String name; 
	private UserResponse userDto;
	
}
