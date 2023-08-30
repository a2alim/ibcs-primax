package com.ibcs.idsdp.rdpprtapp.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import com.sun.istack.NotNull;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

@Data
@Entity
@Table(name = "rtapp_annexure_seven")
@EntityListeners(AuditingEntityListener.class)
public class TppAnnexureSaven extends BaseEntity {

    @Column(name = "letter_of_agreement", columnDefinition = "TEXT")
    private String letterOfAgreement;

    @NotNull
    private Long projectConceptMasterId;

    @NotNull
    @Column(length=50)
    private String projectConceptUuid;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "rtapp_master_id")
    private TappObjectiveCost tappMasterId;
}
