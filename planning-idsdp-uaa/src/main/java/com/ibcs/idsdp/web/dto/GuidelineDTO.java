package com.ibcs.idsdp.web.dto;

import com.ibcs.idsdp.web.dto.request.IUuidIdHolderRequestBodyDTO;
import lombok.Data;


@Data
public class GuidelineDTO implements IUuidIdHolderRequestBodyDTO {
    private Long id;
    private String uuid;
    private String imsModuleId;
    private String imsModuleName;
    private String title;
    private String description;
    private String attachmentName;
    private String attachmentUrl;
    private Boolean isActive;
}
