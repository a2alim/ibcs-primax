package com.ibcs.idsdp.trainninginstitute.web.dto.response;

import com.ibcs.idsdp.trainninginstitute.enums.Status;
import com.ibcs.idsdp.trainninginstitute.model.domain.GOLetterOldModel;
import com.ibcs.idsdp.trainninginstitute.model.domain.PaymentBillVoucherModel;
import com.ibcs.idsdp.trainninginstitute.model.domain.PaymentVoucherModel;
import com.ibcs.idsdp.trainninginstitute.model.domain.TrainingInstituteProfileModel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PartialFinalPaymentResponse {

    private Long id;

    private String uuid;

    private Boolean isDeleted;

    private String createdBy;

    private LocalDate createdOn;

    private String updatedBy;

    private LocalDate updatedOn;

    List<PaymentVoucherModel> paymentVoucherModels;

    List<PaymentBillVoucherResponse> paymentBillVoucherModels;

    private String letterText;

    private String installmentType;

    private LocalDate installmentDate;

    private Integer installmentAmount;

    private String chalanNo;

    private Status status;

    private Long fiscalYearId;

    private LocalDate dateOfAcceptance;

    private TrainingInstituteProfileModel trainingInstituteProfileModel;

    private String proposalName;

    private GOLetterOldModel goLetter;
}
