package com.ibcs.idsdp.idsdpconfigration.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.hibernate.annotations.Columns;
import org.modelmapper.internal.bytebuddy.implementation.bind.MethodDelegationBinder;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

@Data
@Entity
@Table(name = "user_group")
@EntityListeners(AuditingEntityListener.class)
public class UserGroup extends BaseEntity {

    @Column(unique = true)
    private Long userId;

    @OneToOne
    @JoinColumn(referencedColumnName = "ID")
    private Agency agency;

    @OneToOne
    @JoinColumn(referencedColumnName = "ID")
    private MinistryDivision ministryDivision;

    @OneToOne
    @JoinColumn(referencedColumnName = "ID")
    private SectorDivision sectorDivision;

    private String planningMinister;

    private String ecnec;

    private Boolean checked;

}
