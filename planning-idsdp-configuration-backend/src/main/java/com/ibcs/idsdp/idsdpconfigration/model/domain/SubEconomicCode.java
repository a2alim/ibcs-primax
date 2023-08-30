package com.ibcs.idsdp.idsdpconfigration.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

@Data
@Entity
@Table(name = "SUB_ECONOMIC_CODE")
@EntityListeners(AuditingEntityListener.class)
public class SubEconomicCode extends BaseEntity {

    @Column(name = "CODE")
    private String code;

    @ManyToOne(optional = false)
    @JoinColumn(name = "ECONOMIC_CODE_ID")
    private EconomicCode economicCodeId;

    @Column(name = "OLD_SUB_ECONOMIC_CODE_EN")
    private String oldSubEconomicCodeEn;

    @Column(name = "OLD_SUB_ECONOMIC_CODE_BN")
    private String oldSubEconomicCodeBn;

    @Column(name = "SUB_ECONOMIC_CODE")
    private String subEconomicCode;

    @Column(name = "SUB_ECONOMIC_CODE_BNG")
    private String subEconomicCodeBng;

    @Column(name = "SUB_ECONOMIC_CODE_NAME")
    private String subEconomicCodeName;

    @Column(name = "SUB_ECONOMIC_CODE_NAME_BNG")
    private String subEconomicCodeNameBng;

    @Column(name = "DESCRIPTION")
    private String description;

    @Column(name = "DESCRIPTION_BN")
    private String descriptionBn;

    @Column(name = "STATUS")
    private Boolean status;

}
