package com.ibcs.idsdp.idsdpconfigration.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import com.sun.istack.NotNull;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

@Data
@Entity
@Table(name = "optional_cofog")
@EntityListeners(AuditingEntityListener.class)
public class OptionalCofog extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "main_cofog_id")
    private MainCofog mainCofog;

    @NotNull
    @Column(length=255)
    private String code;

    @NotNull
    @Column(length=255)
    private String entryCode;

    @NotNull
    @Column(length=255)
    private String nameEn;

    @NotNull
    @Column(length=255)
    private String nameBn;

    @Column(length=1000)
    private String description;

    private Boolean status;
}
