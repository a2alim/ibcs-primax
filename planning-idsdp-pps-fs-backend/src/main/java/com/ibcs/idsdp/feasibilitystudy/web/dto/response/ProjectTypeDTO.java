package com.ibcs.idsdp.feasibilitystudy.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class ProjectTypeDTO extends UuidIdHolderRequestBodyDTO {
    private String code;
    private String projectTypeCode;
    private String nameEn;
    private String nameBn;
    private String description;
    private Boolean status;
}
