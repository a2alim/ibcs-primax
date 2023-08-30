package com.ibcs.idsdp.dpptapp.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.util.Date;

@Data
@Entity
@Table(name = "tapp_annexure_four_work_schedule")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class TappWorkSchedule extends BaseEntity {

	@Column(name = "tapp_master_id", nullable = false)
    private Long tappMasterId;

    @Column(name = "taskDetails", nullable = false)
    private String taskDetails;

    private String itemName;

    private Date startDate;

    private Date endDate;

    private String status;

    @Column(name = "selectedQuarter", length = 1024)
    private String selectedQuarter;;

}
