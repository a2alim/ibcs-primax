package com.ibcs.idsdp.model.domain;

import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import static com.ibcs.idsdp.constants.TableNameConstants.HELP_TABLE_NAME;

@Data
@Entity
@Table(name = HELP_TABLE_NAME)
public class Help extends BaseEntity {
    @NotNull
    private String firstName;
    @NotNull
    private String lastName;
    @NotNull
    private String email;
    @NotNull
    @Column(name="message", columnDefinition = "TEXT")
    private String message;
    @Column(name="additional_details", columnDefinition = "TEXT")
    private String additionalDetails;
}
