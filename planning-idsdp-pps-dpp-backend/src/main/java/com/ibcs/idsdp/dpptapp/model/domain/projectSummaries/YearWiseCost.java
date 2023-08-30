package com.ibcs.idsdp.dpptapp.model.domain.projectSummaries;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.Table;

@Data
@Entity
@Table(name = "project_summaries_year_wise_cost")
@EntityListeners(AuditingEntityListener.class)
public class YearWiseCost extends BaseEntity {

    private String projectUuid;
    private String fiscalYear;
    private Double gobApprovedDpp;
    private Double gobAdp;
    private Double developmentPartnerApprovedDpp;
    private Double developmentPartnerAdp;
    private Double ownFundApproveDpp;
    private Double ownFundAdp;
    private Double othersDpp;
    private Double totalDpp;
    private Double totalAdp;

}
