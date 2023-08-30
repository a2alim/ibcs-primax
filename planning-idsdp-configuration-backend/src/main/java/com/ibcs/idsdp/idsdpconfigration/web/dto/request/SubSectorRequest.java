package com.ibcs.idsdp.idsdpconfigration.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidHolderRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class SubSectorRequest extends UuidIdHolderRequestBodyDTO {

    private String code;
    private String subSectorCode;
    private String subSectorNameEn;
    private String subSectorNameBn;
    private String description;
    private Boolean status;
    private Long sectorId;
}
