package com.ibcs.idsdp.rdpprtapp.web.dto;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class DppProjectManagementDTO extends UuidIdHolderRequestBodyDTO {

    private Long projectConceptMasterId;
    private Long rdppMasterId;
    private String implementationArrangement;
    private String revenueBudget;
    private String projectConceptUuid;
}
