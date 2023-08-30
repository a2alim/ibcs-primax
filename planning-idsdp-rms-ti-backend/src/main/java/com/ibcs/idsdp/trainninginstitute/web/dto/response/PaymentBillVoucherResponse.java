package com.ibcs.idsdp.trainninginstitute.web.dto.response;

import com.ibcs.idsdp.trainninginstitute.model.domain.TrainingBudgetModel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PaymentBillVoucherResponse {

    private Long id;

    private String uuid;

    private Boolean isDeleted;

    private String createdBy;

    private LocalDate createdOn;

    private String updatedBy;

    private LocalDate updatedOn;

    private TrainingBudgetModel trainingBudgetModel;

    private Long trainingBudgetId;

    private Integer expenditureAmount;

    private Integer vatAndTaxPercentage;

    private Integer vatAndTaxAmount;

    private Integer netPaymentAmount;

    private Integer voucherNumber;
}
