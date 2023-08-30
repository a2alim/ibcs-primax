package com.ibcs.idsdp.trainninginstitute.web.dto.request;

import com.ibcs.idsdp.trainninginstitute.enums.AwardLetterStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AwardLetterRequest {

    private Long proposalId;

    private String subject;

    private String mailBody;

    private String memorandumNo;

    private String nothiDateEn;

    private String letterType;

    private AwardLetterStatus status;

    private boolean mailStatus;

    private String nothiDateBn;

    private Long fiscalYearId;


}
