package com.ibcs.idsdp.trainninginstitute.web.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AgreementInstallmentResponse {

    private String installmentName;

    private Double totalAmount;
}
