package com.ibcs.idsdp.dpptapp.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

@Data
@Entity
@Table(name = "tapp_development_partners")
@EntityListeners(AuditingEntityListener.class)
public class TappDevelopmentPartners extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "tapp_master_id")
    private TappObjectiveCost tappObjectiveCost;

    @Column(name="dev_partner_id")
    private Long devPartnerId;

    @Column(name="mode_finance_id")
    private Long modeFinanceId;

    @Column(name="pa_total_amount")
    private Double paTotalAmount;

    @Column(name="rpa_amount")
    private Double rpaAmount;

    @Column(name="attachment_id")
    private Long attachmentId;


}
