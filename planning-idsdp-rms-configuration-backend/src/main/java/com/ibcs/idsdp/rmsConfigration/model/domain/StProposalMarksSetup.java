package com.ibcs.idsdp.rmsConfigration.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Data
@Entity
@Table(name = "st_proposal_marks_setup")
@Cache( usage = CacheConcurrencyStrategy.READ_WRITE)
public class StProposalMarksSetup extends BaseEntity {

    @ManyToOne(targetEntity = FiscalYear.class)
    private FiscalYear stFiscalYear;

    private String fieldOfAssessment;

    @Column(name = "field_no_1", nullable = false)
    private int fieldNo1;

    @Column(name = "field_no_2", nullable = false)
    private int fieldNo2;

    @Column(name = "field_no_3", nullable = false)
    private int fieldNo3;

    @Column(name = "field_no_4", nullable = false)
    private int fieldNo4;

    @Column(name = "field_no_5", nullable = false)
    private int fieldNo5;

    @Column(name = "field_no_6", nullable = false)
    private int fieldNo6;

    @Column(name = "field_no_7", nullable = false)
    private int fieldNo7;

    @Column(name = "field_no_8", nullable = false)
    private int fieldNo8;

    @Column(name = "field_no_9", nullable = false)
    private int fieldNo9;

    @Column(name = "field_no_10", nullable = false)
    private int fieldNo10;
}
