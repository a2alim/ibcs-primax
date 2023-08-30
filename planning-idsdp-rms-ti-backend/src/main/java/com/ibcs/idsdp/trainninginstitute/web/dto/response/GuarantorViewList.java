package com.ibcs.idsdp.trainninginstitute.web.dto.response;

import com.ibcs.idsdp.common.model.domain.MinioAttachment;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class GuarantorViewList {

    private String courseName;

    private String guarantorName;

    private String jobInfo;

    private String designation;

    private String mobileNo;

    private String email;

    private String presentAddress;

    private String permanentAddress;

    private Integer refundDays;

    private MinioAttachment image;

    private Long nid;

    private MinioAttachment signatureImage;

    private MinioAttachment nidImage;

    private Boolean isActive;
}
