package com.ibcs.idsdp.rpm.web.dto.response;

import com.ibcs.idsdp.rpm.model.domain.UploadUsersImage;

import lombok.Data;

import javax.persistence.Column;

@Data
public class ResearcherProfileResponse {
    private Long id;
    String regNumber;
    Long userId;
    String uuid;
    String minio;
    String emailAddress;
    String nIDNumber;
    String mobileNo;
    String designation;
    String instAddressDetails;
    Long divisionId;
    Long districtId;
    Long upzilaId;
    Long unionId;
    String anotherDetails;
    Long preDivisionId;
    Long preDistrictId;
    Long preUpzilaId;
    Long preUnionId;
    private UploadUsersImage rmsUserImageId;
}
