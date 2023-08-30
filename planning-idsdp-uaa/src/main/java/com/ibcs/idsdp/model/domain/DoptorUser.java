package com.ibcs.idsdp.model.domain;

import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;

@Data
@Entity
public class DoptorUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true)
    private String userId;
    private Boolean isActive;
    @NotNull
    private LocalDate createdOn;

    @PrePersist
    void onCreate(){
        setCreatedOn(LocalDate.now());
    }
}
