package com.ibcs.idsdp.dpptapp.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.Table;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "dpp_development_partners")
@EntityListeners(AuditingEntityListener.class)
public class DppDevelopmentPartners extends BaseEntity {

    @Column(name="dev_partner_id")
    private Long devPartnerId;

    @Column(name="mode_finance_id")
    private Long modeFinanceId;

    @Column(name="gob_amount")
    private Double gobThruAmount;

    @Column(name="sp_ac_amount")
    private Double spAcAmount;

    @Column(name="thru_pd_amount")
    private Double thruPdAmount;

    @Column(name="thru_dp_amount")
    private Double thruDpAmount;

    @Column(name="attachment_id")
    private Long attachmentId;

}
