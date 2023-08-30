package com.ibcs.idsdp.dpptapp.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class ProcurementType extends UuidIdHolderRequestBodyDTO {
    private String code;
    private String nameEn;
    private String nameBn;
    private String description;
    private Boolean status;
}
