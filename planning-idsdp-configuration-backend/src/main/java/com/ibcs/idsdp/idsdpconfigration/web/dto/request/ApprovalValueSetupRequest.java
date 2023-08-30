package com.ibcs.idsdp.idsdpconfigration.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidHolderRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.idsdpconfigration.model.domain.ParipatraVersion;
import com.ibcs.idsdp.idsdpconfigration.model.domain.ProjectType;
import lombok.Data;

@Data
public class ApprovalValueSetupRequest extends UuidIdHolderRequestBodyDTO {

    private String code;

    private ParipatraVersion paripatroVersionNo;
//    private Boolean paripatroVersionNo;

    private Long approvalValueForModule;
//    private Boolean approvalValueForModule;

    private ProjectType projectType;
//    private Boolean projectType;

    private Double amount;

    private String description;

    private Boolean status;
}
