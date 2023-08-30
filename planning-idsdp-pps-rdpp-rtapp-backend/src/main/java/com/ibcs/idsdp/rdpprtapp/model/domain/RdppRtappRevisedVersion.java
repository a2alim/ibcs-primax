package com.ibcs.idsdp.rdpprtapp.model.domain;


import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "rdpp_rtapp_revised_version")
public class RdppRtappRevisedVersion extends BaseEntity {

    @Column(name="revision_time")
    private LocalDate revisionTime;

    @Column(name="rdpp_master_id")
    private Long rdppMasterId;

    @Column(name="rtpp_master_id")
    private Long rtppMasterId;

    @Column(name="version")
    private String version;

    @Column(name = "pcUuid")
    private String pcUuid;


}
