package com.ibcs.idsdp.dpptapp.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import com.ibcs.idsdp.dpptapp.model.domain.tappAnnexurs.TappAnnexureGoods;
import com.sun.istack.NotNull;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.math.BigInteger;
import java.util.Date;

@Data
@Entity
@Table(name = "tapp_annexure_five")
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

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @NotNull
    private Long projectConceptMasterId;

    @NotNull
    @Column(length=50)
    private String projectConceptUuid;
}
