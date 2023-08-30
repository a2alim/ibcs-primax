package com.ibcs.idsdp.idsdpconfigration.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import com.sun.istack.NotNull;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "agency")
@EntityListeners(AuditingEntityListener.class)
public class Agency extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "ministry_division_id")
    private MinistryDivision ministryDivision;

    @NotNull
    @Column(length = 255)
    private String code;

    @NotNull
    @Column(length = 255)
    private String entryCode;

    @NotNull
    @Column(length = 255)
    private String nameEn;

    @NotNull
    @Column(length = 255)
    private String nameBn;

    @NotNull
    private LocalDate fiscalYear;

    @NotNull
    private Double ceilingAmount;

    @NotNull
    @Column(length = 255)
    private String shortName;

    @Column(length = 1000)
    private String description;

    private Boolean status;
}
