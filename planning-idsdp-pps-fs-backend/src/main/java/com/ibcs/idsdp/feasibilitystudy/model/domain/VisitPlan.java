package com.ibcs.idsdp.feasibilitystudy.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.Table;
import java.util.Date;

@Data
@Entity
@Table(name = "fsp_visit_plans")
@EntityListeners(AuditingEntityListener.class)
public class VisitPlan extends BaseEntity {

    @Column(columnDefinition = "TEXT")
    private String taskDetails;

    private Date startDate;

    private Date endDate;

    private String location;

    private String remarks;

    private Long fspMasterId;
}
