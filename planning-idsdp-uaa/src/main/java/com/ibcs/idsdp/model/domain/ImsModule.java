package com.ibcs.idsdp.model.domain;

import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

import static com.ibcs.idsdp.constants.TableNameConstants.IMS_MODULE_TABLE_NAME;

@Data
@Entity
@Table(name = IMS_MODULE_TABLE_NAME)
public class ImsModule extends BaseEntity {
    @NotNull
    private String moduleName;
    @NotNull
    private String moduleFullName;
    @NotNull
    private Boolean isDevelopmentModule;
    private String logoName;
    private String logoUrl;
    private Boolean isActive;
}
