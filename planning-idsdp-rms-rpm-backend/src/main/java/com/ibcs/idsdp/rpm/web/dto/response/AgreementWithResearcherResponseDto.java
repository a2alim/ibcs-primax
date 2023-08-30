package com.ibcs.idsdp.rpm.web.dto.response;

import java.time.LocalDate;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposal;

import lombok.Data;


@Data
public class AgreementWithResearcherResponseDto extends UuidIdHolderRequestBodyDTO {
    private ResearcherProposal researcherProposalId;
    private Double totalGrantAmount;
    private Integer installmentNo;
    private LocalDate researchStartDate;
    private LocalDate researchEndDate;
    private String researchDuration;
    private String firstPage;
    private String secondPage;
    private String thirdPage;
    private String fourthPage;
    private Integer recipientUserId;
    private Boolean isEditable;
    private Integer approvalStatus;
    private Double expenseAmount;
    private Double receivableAmount;
}
