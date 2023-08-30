package com.ibcs.idsdp.trainninginstitute.web.dto.request;

import com.ibcs.idsdp.trainninginstitute.enums.GOLetterStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class GOLetterOldRequest {

    private String subject;

    private String mailBody;

    private String eNothiNo;

    private String dateEnglish;

    private String dateBangla;

    private GOLetterStatus goLetterStatus;

    private Long partialFinalPaymentId;
}
