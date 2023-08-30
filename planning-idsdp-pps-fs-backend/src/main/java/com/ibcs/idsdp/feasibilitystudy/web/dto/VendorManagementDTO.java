package com.ibcs.idsdp.feasibilitystudy.web.dto;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

import java.util.Date;

@Data
public class VendorManagementDTO extends UuidIdHolderRequestBodyDTO {
    private String vendorName;

    private String description;

    private String contactPersonName;

    private String address;

    private String email;

    private Date vendorFormationDate;

    private Long vendorApprovalAttachmentId;

    private Long fspMasterId;
}
