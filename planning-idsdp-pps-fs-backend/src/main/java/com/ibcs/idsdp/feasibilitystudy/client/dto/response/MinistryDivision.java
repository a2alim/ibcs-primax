package com.ibcs.idsdp.feasibilitystudy.client.dto.response;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import com.sun.istack.NotNull;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.Table;

@Data
public class MinistryDivision extends BaseEntity {

    private String code;

    private String entryCode;

    private String nameEn;

    private String nameBn;

    private String shortName;

    private String description;

    private Boolean status;
}
