package com.ibcs.idsdp.dpptapp.model.domain;


import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

@Data
@Entity
@Table(name = "term_of_reference_report")
@EntityListeners(AuditingEntityListener.class)
public class TermOfReferenceReport extends BaseEntity {

    private String pcUuid;
    private Long reportIndex;
    @Column(columnDefinition = "TEXT")
    private String termOfReference;
}
