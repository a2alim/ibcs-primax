package com.ibcs.idsdp.idsdpconfigration.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.Table;

@Data
@Entity
@Table(name = "ECONOMIC_CODE")
@EntityListeners(AuditingEntityListener.class)
public class EconomicCode extends BaseEntity {

    /* @Column(name = "CODE", nullable = false)*/
    private String code;

    @Column(name = "ECONOMIC_CODE_FOR")
    // 1 for Revenue, 2 for Capital
    private Integer economicCodeFor;

    @Column(name = "OLD_ECONOMIC_CODE_EN")
    private String oldEconomicCodeEn;

    @Column(name = "OLD_ECONOMIC_CODE_BN")
    private String oldEconomicCodeBn;

    @Column(name = "ECONOMIC_CODE")
    private String economicCode;

    @Column(name = "ECONOMIC_CODE_BNG")
    private String economicCodeBng;

    @Column(name = "ECONOMIC_CODE_NAME")
    private String economicCodeName;

    @Column(name = "ECONOMIC_CODE_NAME_BNG")
    private String economicCodeNameBng;

    @Column(name = "DESCRIPTION")
    private String description;

    @Column(name = "DESCRIPTION_BN")
    private String descriptionBn;

    @Column(name = "STATUS")
    private Boolean status;

}
