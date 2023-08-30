package com.ibcs.idsdp.dpptapp.web.dto.response;

import lombok.Data;


@Data
public class ModeOfFinanceDTO {
    private Long id;
    private String uuid;
    private String code;
    private Long orderId;
    private String nameEn;
    private String nameBn;
    private String description;
    private boolean status;
    private boolean editable;
}
