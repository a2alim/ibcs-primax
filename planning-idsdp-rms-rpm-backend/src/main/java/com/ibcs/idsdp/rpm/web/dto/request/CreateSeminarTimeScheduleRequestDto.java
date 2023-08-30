package com.ibcs.idsdp.rpm.web.dto.request;

import javax.persistence.Column;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.rpm.model.domain.CreateSeminar;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposal;
import lombok.Data;

/**
 * @author rakibul.hasan
 * @create 10/26/2021
 * @github `https://github.com/rhmtechno`
 */
@Data
public class CreateSeminarTimeScheduleRequestDto extends UuidIdHolderRequestBodyDTO {

    private Long seminarId;
    private Long proposalId;
    private CreateSeminar m2CreateSeminarId;
    private ResearcherProposal m1ResearcherProposalId;
    private String startTime;
    private String positionInSeminar;
    private String scheduleName;
    private Long concernedPersonUserId;
    private String reviewTime;   
    private String mobile;  
    private String emailAddress;
    private String designation;
    private String name; 
}
