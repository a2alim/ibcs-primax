package com.ibcs.idsdp.projectconcept.client.dto.response;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import com.sun.istack.NotNull;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

@Data
public class Agency extends BaseEntity {

    private MinistryDivision ministryDivision;

    private String code;

    private String entryCode;

    private String nameEn;

    private String nameBn;

    private String shortName;

    private String description;

    private Boolean status;
}
