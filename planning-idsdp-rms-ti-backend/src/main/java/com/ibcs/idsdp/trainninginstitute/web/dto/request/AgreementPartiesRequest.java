package com.ibcs.idsdp.trainninginstitute.web.dto.request;

import lombok.*;

@ToString
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AgreementPartiesRequest {
    private String firstPartyName;

    private String firstPartySurname;

    private String firstPartyAddress;

    private String secondPartyName;

    private String secondPartySurname;

    private String secondPartyAddress;

    private String secondPartyPhoneNo;

    private Long secondPartyNidNo;

    private String secondPartyEmail;
}
