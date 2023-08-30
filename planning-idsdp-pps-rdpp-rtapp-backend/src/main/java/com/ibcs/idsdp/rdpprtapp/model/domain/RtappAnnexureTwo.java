package com.ibcs.idsdp.rdpprtapp.model.domain;

import com.ibcs.idsdp.common.model.domain.Attachment;
import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import java.util.Date;

@Data
@Entity
@Table(name = "rtapp_annexure_two_work_schedule")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class RtappAnnexureTwo extends BaseEntity {

	@Column(name = "rtapp_master_id")
    private Long rtappMasterId;

    @Column(name = "taskDetails", nullable = false)
    private String taskDetails;

    private String itemName;

    private Date startDate;

    private Date endDate;

    private String status;

    private String selectedQuarter;

}
