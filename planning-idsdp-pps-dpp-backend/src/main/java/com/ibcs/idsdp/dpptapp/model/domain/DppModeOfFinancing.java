package com.ibcs.idsdp.dpptapp.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.Table;

@Data
@Entity
@Table(name = "dpp_mode_of_financing")
@EntityListeners(AuditingEntityListener.class)
public class DppModeOfFinancing extends BaseEntity {

    @Column(name="mode_id")
    private Long modeId;

    @Column(name="mode_source")
    private String modeSource;

    @Column(name="mode_source_val")
    private String modeSourceVal;

    @Column(name="gob")
    private Double gob;

    @Column(name="gob_fe")
    private Double gobFe;

    @Column(name="pa")
    private Double pa;

    @Column(name="pa_rpa")
    private Double paRpa;

    @Column(name="own_fund")
    private Double ownFund;

    @Column(name="own_fund_fe")
    private Double ownFundFe;

    @Column(name="others")
    private Double others;

    @Column(name="others_fe")
    private Double othersFe;

    @Column(name="pa_sources")
    private String paSources;
}