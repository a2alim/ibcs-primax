package com.ibcs.idsdp.projectconcept.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Data
@Entity
@Table(name = "pc_project_location")
@EntityListeners(AuditingEntityListener.class)
public class ProjectConceptLocation extends BaseEntity {

    @OneToOne
    @JoinColumn(name = "project_concept_master_id", unique = true, nullable = false)
    private ProjectConceptMaster projectConceptMaster;

    @NotNull
    private Long[] division;

    @NotNull
    private Long[] zilla;

    @NotNull
    private Long[] upazila;

    @NotNull
    private Long[] municipality;
}
