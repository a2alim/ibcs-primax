package com.ibcs.idsdp.dpptapp.web.dto.response;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;


@Data
public class PlisProjectShortInfoDTO {
    private Long project_id;
    private String project_name;
    private String agency_name;
    private String user_type;
    private String dpp_status;
    private String sector;
    private String sub_sector;
    private LocalDate project_start_date;
    private LocalDate project_end_date;
    private List<PlisProjectLocationDTO> location;
}
