package com.ibcs.idsdp.web.dto;

import com.ibcs.idsdp.web.dto.request.IUuidIdHolderRequestBodyDTO;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;

@Data
public class ImsModuleDTO implements IUuidIdHolderRequestBodyDTO {
    private Long id;
    private String uuid;
    private String moduleName;
    private String moduleFullName;
    private Boolean isDevelopmentModule;
    private String logoName;
    private String logoUrl;
    private Boolean isActive;
}
