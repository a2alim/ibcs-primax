package com.ibcs.idsdp.idsdpconfigration.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.Table;

@Data
@Entity
@Table(name = "APPROVAL_STATUS")
@EntityListeners(AuditingEntityListener.class)
public class ApprovalStatus extends BaseEntity {

    @Column(name = "CODE", nullable = false)
    private String code;

    @Column(name = "APPROVAL_STATUS_NAME", nullable = false)
    private String approvalStatusName;

    @Column(name = "APPROVAL_STATUS_NAME_BNG")
    private String approvalStatusNameBng;

    @Column(name = "DESCRIPTION")
    private String description;

    @Column(name = "STATUS")
    private Boolean status;
}