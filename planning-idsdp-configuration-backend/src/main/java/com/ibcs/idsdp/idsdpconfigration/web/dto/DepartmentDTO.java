package com.ibcs.idsdp.idsdpconfigration.web.dto;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class DepartmentDTO extends UuidIdHolderRequestBodyDTO {
    private String code;
    private String nameEn;
    private String nameBn;
    private String description;
    private Boolean status;
}
