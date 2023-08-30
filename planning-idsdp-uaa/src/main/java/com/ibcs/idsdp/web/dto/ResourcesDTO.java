package com.ibcs.idsdp.web.dto;

import com.ibcs.idsdp.web.dto.request.IUuidIdHolderRequestBodyDTO;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;


@Data
public class ResourcesDTO implements IUuidIdHolderRequestBodyDTO {
    private Long id;
    private String uuid;
    private String title;
    private String category;
    private String summary;
    private String year;
    private String month;
    private Date publishedDate;
    private String attachmentName;
    private String attachmentUrl;
    private Boolean isActive;
}
