package com.ibcs.idsdp.dpptapp.model.domain;

import com.ibcs.idsdp.common.model.domain.Attachment;
import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.OneToOne;

@Data
@Entity
public class DppTappPresentation extends BaseEntity {
    private String name;
    private Long sourceId;
    private String sourceModule;
    @OneToOne
    private Attachment attachment;
}
