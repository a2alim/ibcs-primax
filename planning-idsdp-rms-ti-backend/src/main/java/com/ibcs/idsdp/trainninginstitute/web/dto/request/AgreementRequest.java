package com.ibcs.idsdp.trainninginstitute.web.dto.request;

import lombok.*;

import java.time.LocalDate;
import java.util.List;

@ToString
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AgreementRequest {

    private LocalDate agreementDate;

    private Long proposalId;

    private AgreementPartiesRequest onBehalf;

    private AgreementPartiesRequest witness;

    private Integer amountOfGrant;

    private Integer traineeRecommended;

    private Long guarantorId;

    private Integer noOfInstallment;

    private List<AgreementInstallmentRequest> agreementInstallments;

    private Long fiscalYearId;
}
