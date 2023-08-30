package com.ibcs.idsdp.trainninginstitute.web.dto.request;


import com.ibcs.idsdp.common.model.domain.MinioAttachment;
import lombok.*;

@ToString
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SendOTPRequest {

    private String mobileNumberOrEmail;
    private Long fiscalYearId;

}
