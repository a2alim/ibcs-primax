package com.ibcs.idsdp.rpm.web.dto.response.configurationResponse;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class SubSectorResponse extends UuidIdHolderRequestBodyDTO {
    private String subFieldName;
    private SectorType sectorTypeId;
}
