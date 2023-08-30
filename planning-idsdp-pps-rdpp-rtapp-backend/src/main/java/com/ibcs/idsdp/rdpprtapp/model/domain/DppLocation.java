package com.ibcs.idsdp.rdpprtapp.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Data
@Entity
@Table(name = "rdpp_locations")
@EntityListeners(AuditingEntityListener.class)
public class DppLocation extends BaseEntity {

    @Column(name="rdpp_master_id")
    private Long rdppMasterId;

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
}
