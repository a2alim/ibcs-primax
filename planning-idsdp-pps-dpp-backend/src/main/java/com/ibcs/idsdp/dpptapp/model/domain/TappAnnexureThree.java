package com.ibcs.idsdp.dpptapp.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

@Data
@Entity
@Table(name = "tapp_annexure_three")
@EntityListeners(AuditingEntityListener.class)
public class TappAnnexureThree extends BaseEntity {

    private String projectConceptUuid;

    private Long projectConceptMasterId;

    @Column(columnDefinition = "TEXT")
    private String consultants;

    @Column(columnDefinition = "TEXT")
    private String educationalQualification;

    @Column(columnDefinition = "TEXT")
    private String experience;

    @Column(columnDefinition = "TEXT")
    private String responsibilities;

    private Integer numberOfPost;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "tapp_master_id")
    private TappObjectiveCost tappMasterId;

}
