package com.ibcs.idsdp.rpm.client.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class CommonTypesResponseDto extends UuidIdHolderRequestBodyDTO {
    private String typeName;
    private String forType;
    private Integer typeNo;
    private boolean active;
    private Integer isEditable;
}
