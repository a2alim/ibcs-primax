package com.ibcs.idsdp.rdpprtapp.model.domain;

import com.ibcs.idsdp.common.model.domain.Attachment;
import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "rdpp_annex_v_vis")
public class DppAnnexVVI extends BaseEntity {

    private String projectConceptUuid;

    private Long projectConceptMasterId;

    private String currentFile;

    @OneToOne
    private Attachment attachmentId;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "rdpp_master_id")
    private DppObjectiveCost objectiveCost;
}
