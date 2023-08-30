package com.ibcs.idsdp.dpptapp.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Data
@Entity
@Table(name = "dpp_locations")
@EntityListeners(AuditingEntityListener.class)
public class DppLocation extends BaseEntity {

    @NotNull
    @OneToOne(fetch = FetchType.LAZY, optional = false, cascade = CascadeType.ALL)
    @JoinColumn(name = "dpp_master_id", referencedColumnName = "id")
    private DppObjectiveCost dppMaster;

    @NotNull
    @Column(name="project_concept_master_id")
    private Long projectConceptMasterId;

    @NotNull
    private Long[] division;

    @NotNull
    private Long[] zilla;

    @NotNull
    private Long[] upazila;

    @NotNull
    private Long[] municipality;

    @Column(name="project_area_justification", columnDefinition = "TEXT")
    private String projectAreaJustification;
}
