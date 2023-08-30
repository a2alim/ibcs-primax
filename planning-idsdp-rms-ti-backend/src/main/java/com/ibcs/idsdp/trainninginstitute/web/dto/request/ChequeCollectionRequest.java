package com.ibcs.idsdp.trainninginstitute.web.dto.request;

import com.ibcs.idsdp.common.model.domain.MinioAttachment;
import lombok.*;

import java.time.LocalDate;

@ToString
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ChequeCollectionRequest {

    private Long instituteId;

    private LocalDate collectionDate;

    private MinioAttachment chequeImage;

    private String chequeReceiverPhoneNo;

    private MinioAttachment signatureImageOfCollectingPerson;

    private String chequeNo;

    private Long receiverNid;

    private Integer chequeAmount;

    private LocalDate chequeDate;

    private Integer tokenNo;

    private String installmentType;

    private String acknowledgementLetter;

    private boolean isChequeReceived;

    private Long proposalId;
}
