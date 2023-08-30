package com.ibcs.idsdp.idsdpconfigration.web.dto;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ParipatraVersionDTO extends UuidIdHolderRequestBodyDTO {
    private String code;
    private String nameEn;
    private String nameBn;
    private LocalDate publishDate;
    private LocalDate startDate;
    private LocalDate endDate;
    private String description;
    private Boolean status;
}
