package com.ibcs.idsdp.trainninginstitute.web.dto.request;

import com.ibcs.idsdp.common.model.domain.MinioAttachment;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProgressVerificationRequest {

    private Long trainingInstituteProfileId;

    private String examinerUserId;

    private LocalDate verificationDate;

//    private String researchTitle;

    private Integer numberOfManPower;

    private String organizationActivity;

    private String monitoring;

    private String comment;

    private MinioAttachment nothi;

    private Long fiscalYearId;

    private Long proposalId;
}
