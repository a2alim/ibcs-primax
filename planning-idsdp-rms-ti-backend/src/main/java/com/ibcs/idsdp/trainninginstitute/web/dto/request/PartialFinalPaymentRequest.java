package com.ibcs.idsdp.trainninginstitute.web.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PartialFinalPaymentRequest {

    private String letterText;

    private String installmentType;

    private LocalDate installmentDate;

    private Integer installmentAmount;

    private String chalanNo;

    List<PaymentVoucherRequest> paymentVoucherModels;

    List<PaymentBillVoucherRequest> paymentBillVoucherModels;

    private Long fiscalYearId;

    private Long proposalId;
    
    private String memorandumNo;
    private LocalDate sendingDate;
    private String sourceNo;
    private LocalDate sourceDate;

}
