package com.ibcs.idsdp.trainninginstitute.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import com.ibcs.idsdp.trainninginstitute.enums.GOLetterStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "M3_GOLetter")
public class GOLetterOldModel extends BaseEntity {

    private String subject;

    @Column(columnDefinition = "TEXT")
    private String mailBody;

    private String eNothiNo;

    private String dateEnglish;

    private String dateBangla;

    private GOLetterStatus goLetterStatus;

}
