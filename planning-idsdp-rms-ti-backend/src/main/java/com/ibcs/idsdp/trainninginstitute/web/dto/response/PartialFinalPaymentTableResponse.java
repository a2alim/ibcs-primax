package com.ibcs.idsdp.trainninginstitute.web.dto.response;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import com.ibcs.idsdp.trainninginstitute.enums.Status;
import com.ibcs.idsdp.trainninginstitute.model.domain.GOLetterOldModel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PartialFinalPaymentTableResponse extends BaseEntity {

    private String installmentType;

    private LocalDate installmentDate;

    private Integer installmentAmount;

    private String chalanNo;

    private Status status;

    private Long fiscalYearId;

    private LocalDate dateOfAcceptance;

    private GOLetterOldModel goLetter;
}
