package com.ibcs.idsdp.rmsConfigration.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class CommonTypesActiveResponseDto extends UuidIdHolderRequestBodyDTO {
    private String typeName;
    private String forType;
    private Integer typeNo;
    private boolean active;
}
