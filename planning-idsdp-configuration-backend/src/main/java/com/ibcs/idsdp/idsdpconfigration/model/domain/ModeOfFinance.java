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
@Table(name = "mode_of_finance")
@EntityListeners(AuditingEntityListener.class)
public class ModeOfFinance extends BaseEntity {

    @NotNull
    @Column(length=255)
    private String code;

    @NotNull
    @Column(length=255)
    private String nameEn;

    @NotNull
    @Column(length=255)
    private String nameBn;

    @Column(length=1000)
    private String description;

    private Boolean status;

    private Boolean editable;

    @Column(name = "order_id")
    private Long orderId;
}
