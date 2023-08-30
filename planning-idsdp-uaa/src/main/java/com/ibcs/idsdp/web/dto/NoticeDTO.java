package com.ibcs.idsdp.web.dto;

import com.ibcs.idsdp.web.dto.request.IUuidIdHolderRequestBodyDTO;
import lombok.Data;

import java.util.Date;


@Data
public class NoticeDTO implements IUuidIdHolderRequestBodyDTO {
    private Long id;
    private String uuid;
    private String title;
    private String summary;
    private Date publishedDate;
    private String attachmentUrl;
    private Boolean isActive;
}
