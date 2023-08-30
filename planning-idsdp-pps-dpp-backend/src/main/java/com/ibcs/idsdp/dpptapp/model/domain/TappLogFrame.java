package com.ibcs.idsdp.dpptapp.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.util.Date;

@Data
@Entity
@Table(name = "tapp_log_frame")
@EntityListeners(AuditingEntityListener.class)
public class TappLogFrame extends BaseEntity {

    @Column(name="project_concept_uuid")
    private String pcUuid;

    @Column(name="project_concept_master_id")
    private Long pcMasterId;

    @Column(name="goal_ns", columnDefinition = "TEXT")
    private String goalNS;

    @Column(name="goal_ovi", columnDefinition = "TEXT")
    private String goalOVI;

    @Column(name="goal_mov", columnDefinition = "TEXT")
    private String goalMOV;

    @Column(name="objective_ns", columnDefinition = "TEXT")
    private String objectiveNS;

    @Column(name="objective_ovi", columnDefinition = "TEXT")
    private String objectiveOVI;

    @Column(name="objective_mov", columnDefinition = "TEXT")
    private String objectiveMOV;

    @Column(name="objective_ia", columnDefinition = "TEXT")
    private String objectiveIA;

    @Column(name="output_ns", columnDefinition = "TEXT")
    private String outputNS;

    @Column(name="output_ovi", columnDefinition = "TEXT")
    private String outputOVI;

    @Column(name="output_mov", columnDefinition = "TEXT")
    private String outputMOV;

    @Column(name="output_ia", columnDefinition = "TEXT")
    private String outputIA;

    @Column(name="input_ns", columnDefinition = "TEXT")
    private String inputNS;

    @Column(name="input_ovi", columnDefinition = "TEXT")
    private String inputOVI;

    @Column(name="input_mov", columnDefinition = "TEXT")
    private String inputMOV;

    @Column(name="input_ia", columnDefinition = "TEXT")
    private String inputIA;

    @OneToOne
    @JoinColumn (name="tapp_master_id")
    private TappObjectiveCost tappMasterId;
}