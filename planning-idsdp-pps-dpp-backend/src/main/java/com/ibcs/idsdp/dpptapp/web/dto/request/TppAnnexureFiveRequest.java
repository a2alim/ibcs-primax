package com.ibcs.idsdp.dpptapp.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidHolderRequestBodyDTO;
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
    private String remarks;
    private String projectConceptUuid;
    public List<TppAnnexureFiveRequest> list;
}
