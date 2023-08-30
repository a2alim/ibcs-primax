package com.ibcs.idsdp.idsdpconfigration.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

@Data
@Entity
@Table(name = "APPROVAL_VALUE_SETUP")
@EntityListeners(AuditingEntityListener.class)
public class ApprovalValueSetup extends BaseEntity {

    @Column(name = "CODE")
    private String code;

    @ManyToOne
    @JoinColumn(name = "PARIPATRO_VERSION_NO_ID")
    private ParipatraVersion paripatroVersionNo;

    @Column(name = "APPROVAL_VALUE_FOR_MODULE", nullable = false)
    private Long approvalValueForModule;

    @ManyToOne
    @JoinColumn(name = "PROJECT_TYPE_ID")
    private ProjectType projectType;

    @Column(name = "AMOUNT", nullable = false)
    private Double amount;

    @Column(name = "DESCRIPTION")
    private String description;

    @Column(name = "STATUS")
    private Boolean status;

}
