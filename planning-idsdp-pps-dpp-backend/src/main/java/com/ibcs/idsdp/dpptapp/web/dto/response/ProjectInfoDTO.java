package com.ibcs.idsdp.dpptapp.web.dto.response;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;


@Data
public class ProjectInfoDTO {
    private String id;
    private String code;
    private int project_revision_no;
    private String name;
    private String name_bangla;
    private String ministry_code;
    private String ministry_name;
    private String agency_code;
    private String agency_name;
    private String concerned_planning_commission_division_code;
    private String concerned_planning_commission_division_name;
    private Boolean has_multiple_agency;
    private Boolean is_self_financed;
    private String adp_sector_code;
    private String adp_sector_name;
    private String adp_sub_sector_code;
    private String adp_sub_sector_name;
    private Boolean has_foreign_location;
    private String approval_authority_name;
    private LocalDateTime date_of_approval;
    private Date go_issue_date;
    private Date administrative_order_date;
    private LocalDate date_of_commencement;
    private LocalDate date_of_completion;
    private String project_type_id;
    private String project_type_name;
}
