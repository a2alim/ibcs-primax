package com.ibcs.idsdp.feasibilitystudy.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.Table;

@Data
@Entity
@Table(name = "fsr_introduction")
@EntityListeners(AuditingEntityListener.class)
public class Introduction extends BaseEntity {
    @Column(columnDefinition = "TEXT")
    private String project_background;

    @Column(columnDefinition = "TEXT")
    private String obj_of_fs_study;

    @Column(columnDefinition = "TEXT")
    private String approach_methodology_fs_study;

    @Column(columnDefinition = "TEXT")
    private String org_fs_study;

    private Long fsrMasterId;
}
