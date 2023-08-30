package com.ibcs.idsdp.rmsConfigration.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Data
@Entity
@Table(name = "st_predefined_template")
@Cache( usage = CacheConcurrencyStrategy.READ_WRITE)
public class PredefineTemplate extends BaseEntity {

    @Column(name = "template_type_id", nullable = false, length = 100)
    private Integer templateTypeId;

    @Column(name = "subject", nullable = false, length = 250)
    private String subject;

    @Column(name = "header", columnDefinition = "TEXT")
    private String header;

    @Column(name = "footer", columnDefinition = "TEXT")
    private String footer;
    @Column(name = "active", nullable = false)
    private Boolean active;

}




