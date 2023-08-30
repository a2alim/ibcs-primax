package com.ibcs.idsdp.dpptapp.web.dto;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;


@Data
public class DppProjectManagementDTO extends UuidIdHolderRequestBodyDTO {

    private Long projectConceptMasterId;
    private Long dppMasterId;
    private String implementationArrangement;
    private String revenueBudget;
    private String revenueBudget2;
    private String projectConceptUuid;
    private Boolean isTransferableToRevenueBudget;
}
