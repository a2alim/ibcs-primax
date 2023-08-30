package com.ibcs.idsdp.dpptapp.model.domain;

import com.fasterxml.jackson.databind.node.LongNode;
import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.util.List;

@Data
@Entity
@Table(name = "dpp_project_management_setup")
@EntityListeners(AuditingEntityListener.class)
public class DppProjectManagementSetup extends BaseEntity {

    @Column(name = "project_concept_uuid")
    private String projectConceptUuid;

    @Column(name = "project_concept_id")
    private Long projectConceptId;

    @Column(name = "name_of_the_post")
    private String nameOfThePost;

    @Column(name = "quantity")
    private Double quantity;

    @Column(name = "qualification", columnDefinition = "TEXT")
    private String qualification;

    @Column(name = "mode_of_recruitment", columnDefinition = "TEXT")
    private String modeOfRecruitment;

    @Column(name = "scale_amount")
    private String scale_amount;

    @Column(name = "pay_grade")
    private String payGrade;
    @Column(name = "responsibility", columnDefinition = "TEXT")
    private String responsibility;

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "types")
    private String types;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "dpp_master_id")
    private DppObjectiveCost objectiveCost;



}
