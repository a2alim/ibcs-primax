package com.ibcs.idsdp.dpptapp.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class DppProjectManagementResponse {

    private String implementationArrangement;
    private String revenueBudget;
    private String revenueBudget2;
    private String uuid;
    private Boolean isTransferableToRevenueBudget;
}
