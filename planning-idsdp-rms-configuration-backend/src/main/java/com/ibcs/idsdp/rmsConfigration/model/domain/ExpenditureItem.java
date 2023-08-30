package com.ibcs.idsdp.rmsConfigration.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

@Data
@Entity
@Table(name = "st_expenditure_item")
@Cache( usage = CacheConcurrencyStrategy.READ_WRITE)
public class ExpenditureItem extends BaseEntity {
    @Column(name = "exp_items_name", nullable = false, length = 250)
    private String expItemsName;

    @Column(name = "exp_items_for",nullable = false, length = 250)
    private String expItemsFor;

    @Column(name = "add_by_admin")
    private Boolean addByAdmin;

    @Column(name = "active", nullable = false)
    private Boolean active;


}




