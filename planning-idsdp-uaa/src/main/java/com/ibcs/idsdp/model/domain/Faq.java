package com.ibcs.idsdp.model.domain;

import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import static com.ibcs.idsdp.constants.TableNameConstants.FAQ_TABLE_NAME;

@Data
@Entity
@Table(name = FAQ_TABLE_NAME)
public class Faq extends BaseEntity {
    private String imsModuleId;

    @Column(name="imsModuleName")
    private String imsModuleName;

    @NotNull
    @Column(name="question", columnDefinition = "TEXT")
    private String question;



    @NotNull
    @Column(name="answer", columnDefinition = "TEXT")
    private String answer;

    private Boolean isActive;
}
