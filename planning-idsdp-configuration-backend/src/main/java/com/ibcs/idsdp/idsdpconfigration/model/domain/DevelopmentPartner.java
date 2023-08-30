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
@Table(name = "DEVELOPMENT_PARTNER")
@EntityListeners(AuditingEntityListener.class)
public class DevelopmentPartner extends BaseEntity {

    @Column(name = "CODE", nullable = false)
    private String code;

    @Column(name = "DEVELOPMENT_PARTNER_NAME", nullable = false)
    private String developmentPartnerName;

    @Column(name = "DEVELOPMENT_PARTNER_NAME_BNG")
    private String developmentPartnerNameBng;

    @Column(name = "DESCRIPTION")
    private String description;

    @Column(name = "STATUS")
    private Boolean status;

}