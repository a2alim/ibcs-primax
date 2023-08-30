package com.ibcs.idsdp.rpm.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidHolderRequestBodyDTO;
import com.ibcs.idsdp.rpm.model.domain.MinioAttachment;
import lombok.Data;

/**
 * @author moniruzzaman.rony
 * @create 10/12/21
 * @github `https://github.com/moniruzzamanrony`
 */

@Data
public class EducationInfoRequest extends UuidHolderRequestBodyDTO {
    private Long id;
    private  long profilePersonalInfoId;
    private String certificationName;
    private String passingYearMonth;
    private String division;
    private String cgpa;
    private String scale;
    private String instituteName;
    private Boolean isForeign;
    private String uploadCertificateImage;
    private String universityRegNo;
    private String discipline;
    private Long divisionClassOrCgpa;
    private Boolean isEditable;
    private String registrationNo;
    private Integer thesisGroup;
    private String subject;
    private MinioAttachment fileUploadModel;
    private boolean isDeleted;
}
