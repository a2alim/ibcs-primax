package com.ibcs.idsdp.rpm.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Data
@Entity
@Table(name = "m1_researcher_profile_training_info")
public class ProfileTraining extends BaseEntity {
    @Column(nullable = false, length = 20)
    long profilePersonalInfoId;

    @Column(nullable = false, length = 255)
    String trainingName;

    @Column(nullable = false, length = 255)
    String instituteOrCenterName;

    @Column(nullable = false, length = 255)
    String duration;

    @Column(nullable = false, length = 255)
    String result;
    
    @Column(nullable = false, length = 255)
    String trainingTopic;

    boolean isEditable;

}
