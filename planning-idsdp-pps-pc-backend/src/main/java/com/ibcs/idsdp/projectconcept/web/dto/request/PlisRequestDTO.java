package com.ibcs.idsdp.projectconcept.web.dto.request;

import lombok.Data;

import java.util.Date;


@Data
public class PlisRequestDTO {
    private Long project_id;
    private String plis_pdf_url;
    private Date created_date;
}
