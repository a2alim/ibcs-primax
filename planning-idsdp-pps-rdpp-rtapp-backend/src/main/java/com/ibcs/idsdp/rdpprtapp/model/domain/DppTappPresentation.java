package com.ibcs.idsdp.rdpprtapp.model.domain;

import com.ibcs.idsdp.common.model.domain.Attachment;
import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Data
@Entity
@Table(name = "rdpp-tapp-presentation")
public class DppTappPresentation extends BaseEntity {
    private String name;
    private Long sourceId;
    private String sourceModule;
    @OneToOne
    private Attachment attachment;
}
