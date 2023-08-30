package com.ibcs.idsdp.dpptapp.web.dto.amsDTO;

import com.ibcs.idsdp.dpptapp.client.dto.request.SectorDivisionDTO;
import lombok.Data;

import java.sql.Date;


@Data
public class AmsGreenPageDTO {
    private int _project_id;
    private String _fiscal_year_name;
    private String project_title;
    private String project_tiltle_bn;
    private int project_type; // 1=dpp , 2= tapp
    private Long projectTypeId;
    private String projectType;
    private String project_code; //127
    private int priority_id;
    private String objectives;
    private String objectives_bn;
    private String isOnlyGob;
    private Double total;
    private Double gob;
    private Double pa;
    private Double own_fund;
    private Double other;
    private Date date_of_commencement;
    private Date date_of_completion;
    private int is_foreign_aid;
    private int approval_status;
    private Date approval_date;
    private String sector_Division_Code;
    private String sector_Div_Name;
    private String sector_Div_Name_bn;
    private AmsMinistryDTO ministry;
    private AmsAgencyDTO agency;
    private AmsSectorDTO sector;
    private AmsSubSectorDTO subsector;
    private SectorDivisionDTO sectorDivision;
}
