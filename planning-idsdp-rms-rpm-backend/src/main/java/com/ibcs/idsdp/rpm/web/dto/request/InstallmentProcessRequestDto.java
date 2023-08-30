package com.ibcs.idsdp.rpm.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposal;
import lombok.Data;

import java.util.Date;

/**
 * @author rakibul.hasan
 * @create 10/26/2021
 * @github `https://github.com/rhmtechno`
 */
@Data
public class InstallmentProcessRequestDto extends UuidIdHolderRequestBodyDTO {

    private Long proposalId;

    private ResearcherProposal m1ResearcherProposalId;

    private Long stInstallmentTypeId;

    private Integer percentageAmount;

    private Double tkAmount;

    private Date installmentDate;

    private String subject;

    private String mailBody;

    private String installmentStatus;

    private Boolean isSend;

    private String goLetterUuid;

    private String installmentTypes;
    private String prcAmount;
    private String totalAmount;
}
