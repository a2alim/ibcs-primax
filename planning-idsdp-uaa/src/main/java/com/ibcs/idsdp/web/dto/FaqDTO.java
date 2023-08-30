package com.ibcs.idsdp.web.dto;

import com.ibcs.idsdp.web.dto.request.IUuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class FaqDTO implements IUuidIdHolderRequestBodyDTO {
    private Long id;
    private String uuid;
    private String imsModuleId;
    private String imsModuleName;
    private String question;
    private String answer;
    private Boolean isActive;
}
