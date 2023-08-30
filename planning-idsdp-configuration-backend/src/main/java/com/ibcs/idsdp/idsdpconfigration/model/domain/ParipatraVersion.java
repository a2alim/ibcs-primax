package com.ibcs.idsdp.idsdpconfigration.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.Table;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "paripatra_version")
@EntityListeners(AuditingEntityListener.class)
public class ParipatraVersion extends BaseEntity {

    private String code;
    private String nameEn;
    private String nameBn;
    private LocalDate publishDate;
    private LocalDate startDate;
    private LocalDate endDate;
    private String description;
    private Boolean status;

}