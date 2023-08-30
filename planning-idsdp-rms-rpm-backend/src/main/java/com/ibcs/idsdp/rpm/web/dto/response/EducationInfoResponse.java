package com.ibcs.idsdp.rpm.web.dto.response;

import com.ibcs.idsdp.rpm.model.domain.MinioAttachment;
import lombok.Data;

/**
 * @author moniruzzaman.rony
 * @create 10/12/21
 * @github `https://github.com/moniruzzamanrony`
 */

@Data
public class EducationInfoResponse {
    private  long profilePersonalInfoId;
    private String certificationName;
    private String passingYearMonth;
    private String division;
    private String cgpa;
    private String instituteName;
    private Boolean isForeign;
    private String uploadCertificateImage;
    private String universityRegNo;
    private String discipline;
    private Long divisionClassOrCgpa;
    private Boolean isEditable;
    private String registrationNo;
    private Integer thesisGroup;
    private MinioAttachment fileUploadModel;
    private boolean isDeleted;
}
