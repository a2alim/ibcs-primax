package com.ibcs.idsdp.trainninginstitute.web.dto.request;

import lombok.*;

@ToString
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AgreementInstallmentRequest {

    private String installmentName;

    private Integer percentageOfInstallment;

    private double totalAmount;
}
