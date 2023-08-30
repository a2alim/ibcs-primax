package com.ibcs.idsdp.idsdpconfigration.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.Table;

@Data
@Entity
@Table(name = "procurement_method")
@EntityListeners(AuditingEntityListener.class)
public class ProcurementMethod extends BaseEntity {
    private String code;
    private String procurementMethodFor;
    private String nameEn;
    private String nameBn;
    private String description;
    private Boolean status;
}
