package com.ibcs.idsdp.idsdpconfigration.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import com.sun.istack.NotNull;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.Table;

@Data
@Entity
@Table(name = "unit_types")
@EntityListeners(AuditingEntityListener.class)
public class UnitType extends BaseEntity {

        @NotNull
        @Column(length=128)
        private String code;

        @NotNull
        @Column(length=150)
        private String unitTypeNameEng;

        @Column(length=150)
        private String unitTypeNameBng;

        @Column(length=255)
        private String description;

        private Boolean status;
}
