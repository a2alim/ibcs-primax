package com.ibcs.idsdp.idsdpconfigration.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidHolderRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class ProcurementMethodRequest extends UuidIdHolderRequestBodyDTO {
    private String code;
    private String nameEn;
    private String nameBn;
    private String procurementMethodFor;
    private String description;
    private Boolean status;
}
