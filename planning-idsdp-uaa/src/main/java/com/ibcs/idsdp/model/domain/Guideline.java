package com.ibcs.idsdp.model.domain;

import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import static com.ibcs.idsdp.constants.TableNameConstants.GUIDELINE_TABLE_NAME;

@Data
@Entity
@Table(name = GUIDELINE_TABLE_NAME)
public class Guideline extends BaseEntity {
    @NotNull
    private String imsModuleId;
    @NotNull
    private String imsModuleName;
    @NotNull
    private String title;
    @NotNull
    @Column(name="description", columnDefinition = "TEXT")
    private String description;
    private String attachmentName;
    private String attachmentUrl;
    private Boolean isActive;
}
