package com.ibcs.idsdp.dpptapp.model.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

@Data
@Entity
@Table(name = "tapp_annexure_six_tasks_qua")
@EntityListeners(AuditingEntityListener.class)
public class TappSupportStuff extends BaseEntity {

    @Column(columnDefinition = "TEXT")
    private String designation;

    @Column(columnDefinition = "TEXT")
    private String educationalQualification;

    @Column(columnDefinition = "TEXT")
    private String experience;

    @Column(columnDefinition = "TEXT")
    private String taskPerformed;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    private String type;

    private Long projectConceptMasterId;
}
