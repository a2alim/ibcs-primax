package com.ibcs.idsdp.feasibilitystudy.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.Table;
import java.util.Date;

@Data
@Entity
@Table(name = "fsp_work_plans")
@EntityListeners(AuditingEntityListener.class)
public class WorkPlan extends BaseEntity {

    private String taskDetails;

    private Long committeeId;

    private Long vendorId;

    private Date startDate;

    private Date endDate;

    private String status;

    private Long fspMasterId;

}
