package com.ibcs.idsdp.rpm.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;

import javax.persistence.*;

/**
 * @author rakibul.hasan
 * @create 10/21/2021
 * @github `https://github.com/rhmtechno`
 */
@Data
@Entity
@Table(name = "m2_seminar_email")
public class SeminarEmail extends BaseEntity {

   private Long committeeTypeId;

    private String mailTo;

    private String subject;

    private String body;

    private String seminarId;

}
