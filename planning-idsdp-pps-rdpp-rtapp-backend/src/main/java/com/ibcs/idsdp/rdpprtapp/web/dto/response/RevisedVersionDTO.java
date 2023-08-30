package com.ibcs.idsdp.rdpprtapp.web.dto.response;

import lombok.Data;


@Data
public class RevisedVersionDTO {
    private String currentVersion;
    private String previousVersion;
    private String currentVersionBn;
    private String previousVersionBn;
    private Integer revisedVersionNumber;
}
