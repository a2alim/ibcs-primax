package com.ibcs.idsdp.feasibilitystudy.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

@Data
@Entity
@Table(name = "fsr_project_geo_location")
@EntityListeners(AuditingEntityListener.class)
public class ProjectLocation extends BaseEntity {

    @NotNull
    private Long[] division;

    @NotNull
    private Long[] zilla;

    @NotNull
    private Long[] upazila;

    @NotNull
    private Long[] municipality;

    private Long fsrMasterId;

}
