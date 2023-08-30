package com.ibcs.idsdp.rdpprtapp.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import com.sun.istack.NotNull;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

@Data
@Entity
@Table(name = "rtapp_annexure_five")
@EntityListeners(AuditingEntityListener.class)
public class TppAnnexureFive extends BaseEntity {

    @Column(columnDefinition = "TEXT")
    @NotNull
    private String designation;

    @Column(columnDefinition = "TEXT")
    @NotNull
    private String educationalQualifications;

    @Column(columnDefinition = "TEXT")
    @NotNull
    private String experiences;

    @Column(columnDefinition = "TEXT")
    @NotNull
    private String tasksPerformed;

    @NotNull
    private Long projectConceptMasterId;

    @NotNull
    @Column(length=50)
    private String projectConceptUuid;
}
