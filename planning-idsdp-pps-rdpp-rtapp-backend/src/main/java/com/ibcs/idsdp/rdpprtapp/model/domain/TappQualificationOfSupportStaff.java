package com.ibcs.idsdp.rdpprtapp.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.util.List;

@Data
@Entity
@Table(name = "rtapp_annexure_six")
@EntityListeners(AuditingEntityListener.class)
public class TappQualificationOfSupportStaff extends BaseEntity {

    private String projectConceptUuid;
    private Long projectConceptId;
    private Double gobFund;
    private Double rpaFund;
    private Double dpaFund;
    private Double others;
    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "rtapp_annexure_six_tasks_qua_id")
    private List<TappSupportStuff> tappSupportStuffList;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "rtapp_master_id")
    private TappObjectiveCost tappMasterId;
}
