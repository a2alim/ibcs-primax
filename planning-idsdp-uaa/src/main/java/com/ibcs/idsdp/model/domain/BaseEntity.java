package com.ibcs.idsdp.model.domain;

import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;

@MappedSuperclass
@Data
public abstract class BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private String uuid;

    @NotNull
    private Boolean isDeleted;

    @NotNull
    private String createdBy;

    @NotNull
    private LocalDateTime createdOn;

    private String updatedBy;

    private LocalDateTime updatedOn;
}
