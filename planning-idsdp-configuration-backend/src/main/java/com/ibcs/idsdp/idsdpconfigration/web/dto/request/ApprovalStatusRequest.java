package com.ibcs.idsdp.idsdpconfigration.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidHolderRequestBodyDTO;
import lombok.Data;

import javax.validation.constraints.NotEmpty;

@Data
public class ApprovalStatusRequest extends UuidHolderRequestBodyDTO {

    private String code;
    @NotEmpty
    private String approvalStatusName;
    @NotEmpty
    private String approvalStatusNameBng;
    private String description;
    private Boolean status;
}
