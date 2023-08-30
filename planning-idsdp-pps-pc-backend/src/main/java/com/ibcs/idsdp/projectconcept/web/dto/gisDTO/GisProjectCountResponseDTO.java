package com.ibcs.idsdp.projectconcept.web.dto.gisDTO;

import com.ibcs.idsdp.projectconcept.web.dto.ProjectConceptMasterDTO;
import lombok.Data;

import java.util.List;

@Data
public class GisProjectCountResponseDTO {
    private String geoCode;
    private String nameEn;
    private String nameBn;
    private long projectCount;
    private List<ProjectConceptMasterDTO> projectList;
}
