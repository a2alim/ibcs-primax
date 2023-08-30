package com.ibcs.idsdp.dpptapp.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

@Data
@Entity
@Table(name = "tapp_annexure_two")
@EntityListeners(AuditingEntityListener.class)
public class TappTermOfReference extends BaseEntity {

    @Column(columnDefinition = "TEXT")
    private String institutionalAgreement;

    private String projectConceptUuid;

    private Long projectConceptMasterId;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "tapp_master_id")
    private TappObjectiveCost objectiveCost;
}
