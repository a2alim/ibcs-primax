package com.ibcs.idsdp.common.model.domain;

import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "dashboard_attachment_fs")
@Data
public class DashboardAttachment extends BaseEntity {
    private Long fspMasterId;
    private String title;
    @OneToOne
    private Attachment attachment;
}
