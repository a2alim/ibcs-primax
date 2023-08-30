package com.ibcs.idsdp.trainninginstitute.web.dto.request;

import com.ibcs.idsdp.common.model.domain.MinioAttachment;
import lombok.*;

@ToString
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class GuarantorRequest {

    private Long proposalId;

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

    private Long fiscalYearId;


}
