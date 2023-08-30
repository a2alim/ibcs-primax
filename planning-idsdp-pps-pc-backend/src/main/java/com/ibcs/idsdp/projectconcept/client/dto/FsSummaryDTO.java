package com.ibcs.idsdp.projectconcept.client.dto;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

import java.util.Date;

@Data
public class FsSummaryDTO extends UuidIdHolderRequestBodyDTO {
    private String title_en;

    private String title_bn;

    private String sponsoring_ministry_id;

    private String implementing_agency_id;

    private String project_objectives;

    private Double estimated_proj_cost;

    private Long sector_id;

    private Long sub_sector_id;

    private Long project_category_id;

    private Date date_of_commencement;

    private Date date_of_completion;

    private Long projectConceptMasterId;

    private String projectConceptMasterUuid;

    private Long paripatraVersionId;

    private Long dppMasterId;
}
