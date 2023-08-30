package com.ibcs.idsdp.rpm.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.rpm.client.dto.response.ResearchCategoryTypeResponseDto;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposal;
import com.ibcs.idsdp.rpm.web.dto.response.configurationResponse.FiscalYearResponse;
import com.ibcs.idsdp.rpm.web.dto.response.configurationResponse.InstallmentTypeResponseDto;

import lombok.Data;

import java.util.Date;


@Data
public class InstallmentProcessResponseDto extends UuidIdHolderRequestBodyDTO {


    private ResearcherProposal m1ResearcherProposalId;

    private Long stInstallmentTypeId;

    private Integer percentageAmount;

    private Double tkAmount;

    private Date installmentDate;

    private String subject;

    private String mailBody;

    private String installmentStatus;

    private Boolean isSend;

    private InstallmentTypeResponseDto InstallmentType;
    
    private FiscalYearResponse fiscalYearResponse;
    
    private ResearchCategoryTypeResponseDto researchCategoryType;

    private String goLetterUuid;
    
    private GoLetterResponseDto goLetterResponseDto;

    private String installmentTypes;
    private String prcAmount;
    private String totalAmount;
}
