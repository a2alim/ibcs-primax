package com.ibcs.idsdp.rpm.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class CreateGOLetterRequestDto extends UuidIdHolderRequestBodyDTO {

    private PageableRequestBodyDTO pageableRequestBodyDTO;

    private String goCode;
    private Long researcherProposalId;
    private Long installmentProcessId;
    private Long installmentTypeId;
    private Long fiscalYearId;
    private Long researchCatTypeId;
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
}
