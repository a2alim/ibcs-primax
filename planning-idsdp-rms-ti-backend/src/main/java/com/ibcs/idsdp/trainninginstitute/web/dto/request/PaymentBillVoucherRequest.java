package com.ibcs.idsdp.trainninginstitute.web.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PaymentBillVoucherRequest {

    private Long trainingBudgetId;

    private Integer expenditureAmount;

    private Integer vatAndTaxPercentage;

    private Integer vatAndTaxAmount;

    private Integer netPaymentAmount;

    private Integer voucherNumber;

}
