package com.ibcs.idsdp.rmsConfigration.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import com.ibcs.idsdp.rmsConfigration.constants.CommonTypeENUM;
import lombok.Data;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Data
@Entity
@Table(name = "st_common_types")
@Cache( usage = CacheConcurrencyStrategy.READ_WRITE)
public class CommonTypes extends BaseEntity {
    @Column(name = "type_name", nullable = false, length = 150)
    private String typeName;

    @Column(name = "for_type", nullable = false, length = 50)
    private String forType;

    @Column(name = "type_no", nullable = false, length = 3)
    private Integer typeNo;

    @Column(name = "active", nullable = false, length = 150)
    private boolean active;

    @Column(name = "is_editable", length = 2)
    private Integer isEditable;
}
