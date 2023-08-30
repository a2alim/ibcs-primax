package com.ibcs.idsdp.idsdpconfigration.web.dto;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class ProjectMovementDTO extends UuidIdHolderRequestBodyDTO {
    private Long orderId;
    private String code;
    private String statusButtonPosition;
    private Boolean editable;
    private String movementTitleEn;
    private String movementTitleBn;
    private String description;
    private Long moduleId;
    private Long userGroupId;
    private Boolean status;
}
