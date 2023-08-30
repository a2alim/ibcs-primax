package com.ibcs.idsdp.idsdpconfigration.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidHolderRequestBodyDTO;
import lombok.Data;

@Data
public class PriorityResponse extends UuidHolderRequestBodyDTO {
    private String code;
    private String nameEn;
    private String nameBn;
    private String description;
    private Boolean status;
}
