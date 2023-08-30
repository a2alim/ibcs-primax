package com.ibcs.idsdp.rdpprtapp.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

import java.util.Date;

@Data
public class RtappAnnexureTwoDto extends UuidIdHolderRequestBodyDTO {

    private Long rtappMasterId;

    private String taskDetails;
    private String itemName;
    private Date startDate;
    private Date endDate;
    private String status;
    private String selectedQuarter;

}
