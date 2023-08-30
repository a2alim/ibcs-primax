package com.ibcs.idsdp.rdpprtapp.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.Table;

@Data
@Entity
@Table(name = "rdpp_cost_of_major_item")
@EntityListeners(AuditingEntityListener.class)
public class CostOfMajorItem extends BaseEntity {


    private String majorItem;

    private Long unit;

    private Double proposalProject;

    @Column(columnDefinition = "TEXT")
    private String similarGoingProject;

    @Column(columnDefinition = "TEXT")
    private String similarCompleteProject;

    @Column(columnDefinition = "TEXT")
    private String remarks;

}
