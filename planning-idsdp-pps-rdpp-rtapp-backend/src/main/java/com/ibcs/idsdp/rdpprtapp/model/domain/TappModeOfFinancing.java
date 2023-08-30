package com.ibcs.idsdp.rdpprtapp.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

@Data
@Entity
@Table(name = "rtapp_mode_of_financing")
@EntityListeners(AuditingEntityListener.class)
public class TappModeOfFinancing extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "rtapp_master_id")
    private TappObjectiveCost tappObjectiveCost;

//    @Column(name = "project_concept_master_id")
//    private Long projectConceptMasterId;
//    @Column(name="project_concept_uuid")
//    private String projectConceptUuid;

    @Column(name="gob_ea")
    private Double gobEA;
    @Column(name="gob_local")
    private Double gobLocal;
    @Column(name="gob_fe")
    private Double gobFe;
    @Column(name="gob_total")
    private Double gobTotal;
    @Column(name="gob_source")
    private String gobSource;

    @Column(name="development_ea")
    private Double developmentEA;
    @Column(name="development_local")
    private Double developmentLocal;
    @Column(name="development_fe")
    private Double developmentFe;
    @Column(name="development_total")
    private Double developmentTotal;
    @Column(name="development_source")
    private String developmentSource;

    @Column(name="own_fund_ea")
    private Double ownFundEA;
    @Column(name="own_fund_local")
    private Double ownFundLocal;
    @Column(name="own_fund_fe")
    private Double ownFundFe;
    @Column(name="own_fund_total")
    private Double ownFundTotal;
    @Column(name="own_fund_source")
    private String ownFundSource;

    @Column(name="others_specify_ea")
    private Double othersSpecifyEA;
    @Column(name="others_specify_local")
    private Double othersSpecifyLocal;
    @Column(name="others_specify_fe")
    private Double othersSpecifyFe;
    @Column(name="others_specify_total")
    private Double othersSpecifyTotal;
    @Column(name="othersSpecifySource")
    private String othersSpecifySource;

    @Column(name="grand_total_ea")
    private Double grandTotalEa;

    @Column(name="grand_total_local")
    private Double grandTotalLocal;

    @Column(name="grand_total_fe")
    private Double grandTotalFe;

    @Column(name="grand_total_total")
    private Double grandTotalTotal;


}