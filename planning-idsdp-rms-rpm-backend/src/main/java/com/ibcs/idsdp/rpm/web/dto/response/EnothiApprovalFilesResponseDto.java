package com.ibcs.idsdp.rpm.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.rpm.client.dto.response.ResearchCategoryTypeResponseDto;
import lombok.Data;

import java.time.LocalDate;

@Data
public class EnothiApprovalFilesResponseDto extends UuidIdHolderRequestBodyDTO {
    private Long stFiscalYearId;
    private Long stResearchCategoryTypeId;
    private String subject;
    private Boolean internalApproval;
    private String note;
    private String dataFor;
    private String bucketName;
    private String fileDownloadUrl;
    private String fileName;
    private String dakReceivedNo;
    private Long dakId;
    private Long currentDeskId;
    private Boolean isSent;
    private LocalDate sendingDate;
    private String m1ResearcherProposalUuid;
    private String createdBy;
}
