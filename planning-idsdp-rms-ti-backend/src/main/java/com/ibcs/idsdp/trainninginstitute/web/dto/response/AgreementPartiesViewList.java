package com.ibcs.idsdp.trainninginstitute.web.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class AgreementPartiesViewList {
    private String firstPartyName;

    private String firstPartySurname;

    private String firstPartyAddress;

    private String secondPartyName;

    private String secondPartySurname;

    private String secondPartyAddress;

    private String secondPartyPhoneNo;

    private String secondPartyNidNo;

    private String secondPartyEmail;
}
