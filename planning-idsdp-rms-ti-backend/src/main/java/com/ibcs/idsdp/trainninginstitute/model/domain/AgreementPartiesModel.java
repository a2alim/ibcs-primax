package com.ibcs.idsdp.trainninginstitute.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@ToString
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "M3_AGREEMENT_PARTIES")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class AgreementPartiesModel extends BaseEntity {

    private String firstPartyName;

    private String firstPartySurname;

    private String firstPartyAddress;

    private String secondPartyName;

    private String secondPartySurname;

    private String secondPartyAddress;

    @Column(length = 20)
    private String secondPartyPhoneNo;

    @Column(length = 17)
    private Long secondPartyNidNo;

    private String secondPartyEmail;

}
