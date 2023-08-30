package com.ibcs.idsdp.dpptapp.web.dto;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.EntityListeners;

@Data
@EntityListeners(AuditingEntityListener.class)
public class TppAnnexureSavenDTO extends UuidIdHolderRequestBodyDTO {
    private String letterOfAgreement;
    private Integer status;
    private String message;

}
