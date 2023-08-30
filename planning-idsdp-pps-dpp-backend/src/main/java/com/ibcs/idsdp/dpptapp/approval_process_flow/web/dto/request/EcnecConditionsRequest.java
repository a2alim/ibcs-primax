package com.ibcs.idsdp.dpptapp.approval_process_flow.web.dto.request;

import lombok.Data;

@Data
public class EcnecConditionsRequest {
    private Long projectMovementStageId;
    private String conditions;
}
