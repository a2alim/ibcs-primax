package com.ibcs.idsdp.rdpprtapp.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

@Data
@Entity
@Table(name = "rtapp_year_cost_summery")
@EntityListeners(AuditingEntityListener.class)
public class TappYearCostSummery extends BaseEntity {

    @Column(name="indicate_issues", columnDefinition = "TEXT")
    private String indicateIssues;

    @Column(name="indicate_issues_not_work", columnDefinition = "TEXT")
    private String indicateIssuesNotWork;

    @Column(name = "project_summery_master_id")
    private Long projectSummeryMasterId;

    @Column(name="status")
    private Boolean status;
//
//    @OneToOne
//    @JoinColumn(name="tapp_master_id")
//    private TappObjectiveCost tappMasterId;
}
