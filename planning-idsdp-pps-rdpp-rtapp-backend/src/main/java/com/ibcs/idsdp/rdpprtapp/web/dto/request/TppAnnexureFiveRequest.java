package com.ibcs.idsdp.rdpprtapp.web.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class TppAnnexureFiveRequest{
    private Long id;
    private String uuid;
    private String designation;
    private String educationalQualifications;
    private String experiences;
    private String tasksPerformed;
    private String projectConceptUuid;
    public List<TppAnnexureFiveRequest> list;
}
