package com.ibcs.idsdp.dpptapp.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.util.List;

@Data
@Entity
@Table(name = "dpp_mtbf")
@EntityListeners(AuditingEntityListener.class)
public class DppMtbf extends BaseEntity {
    private Long projectConceptId;
    private String projectConceptUuid;
    private Integer numberOfOngoingProject;
    private Double costOfApprovedProject;
    private Double cumulativeExpenditure;
    private Double allocationRequiredForOngoingProject;
    private Double allocationInCurrentFiscalYear;
    private Integer numberOfApprovedProject;
    private Integer numberOfRecommendedProject;
    private String wayOfFinancing;

    @LazyCollection(LazyCollectionOption.FALSE)
    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "dpp_mtbf_id")
    List<DppMtbfFiscalYearDetail> mtbfFiscalYearDetailList;
}
