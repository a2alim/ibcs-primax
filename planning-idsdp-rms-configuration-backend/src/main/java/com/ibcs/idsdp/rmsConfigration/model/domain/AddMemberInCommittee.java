package com.ibcs.idsdp.rmsConfigration.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "st_add_member_in_committee")
public class AddMemberInCommittee extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "st_fiscal_year_id", length = 20, nullable = true)
    private Long stFiscalYearId;

    @Column(name = "st_committee_type_id", length = 20, nullable = true)
    private Long stCommitteeTypeId;

    @Column(name = "user_id", length = 20, nullable = true)
    private Long userId;

    @Column(name = "is_chairman", length = 2, nullable = true)
    private Integer isChairman;

    @Column(name = "active", nullable = true)
    private Boolean active;
}
