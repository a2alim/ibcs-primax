package com.ibcs.idsdp.trainninginstitute.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import com.ibcs.idsdp.common.model.domain.MinioAttachment;
import lombok.*;

import javax.persistence.*;

@ToString
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "M3_ENOTHI")
public class ENothiModel extends BaseEntity {
    private Long fiscalYearId;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private MinioAttachment eNothi;
}
