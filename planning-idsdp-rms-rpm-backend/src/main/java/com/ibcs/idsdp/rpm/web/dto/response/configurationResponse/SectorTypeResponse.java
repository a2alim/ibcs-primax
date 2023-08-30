package com.ibcs.idsdp.rpm.web.dto.response.configurationResponse;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class SectorTypeResponse extends UuidIdHolderRequestBodyDTO {
    private String fieldName;
}
