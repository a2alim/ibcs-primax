package com.ibcs.idsdp.rpm.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

import javax.persistence.Column;
import java.time.LocalDateTime;

@Data
public class letterForStackohlderRequestDto extends UuidIdHolderRequestBodyDTO{

    private Long stFiscalYearId;
    private Long stSectorTypeId;
    private LocalDateTime lastFeedbackDate;
    private String	recipientName;
    private String recipientDesignation;
    private String recipientOfficeAddress;
    private String mobileNo;
    private String emailAddress;
    private String details;
    private Integer letterStatus;



}
