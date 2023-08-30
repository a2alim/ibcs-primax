package com.ibcs.idsdp.trainninginstitute.web.dto.response;

import com.ibcs.idsdp.trainninginstitute.model.domain.AgreementPartiesModel;
import com.ibcs.idsdp.trainninginstitute.model.domain.AgreementStatus;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AgreementViewList {


    private LocalDate agreementDate;

    private Long courseId;

    private Long trainingId;

    private AgreementPartiesModel onBehalf;

    private AgreementPartiesModel witness;

    private Integer amountOfGrant;

    private Integer traineeRecommended;

    private String guarantor;

    private Long guarantorId;

    private Integer noOfInstallment;

    private AgreementStatus agreementStatus;

    private Long fiscalYear;

    private boolean isEditable;

    private List<AgreementInstallmentViewList> installmentViewLists;
    private List<GuarantorViewList> guarantorViewListList;
    private List<ParticipantView> participantViewList;
}
