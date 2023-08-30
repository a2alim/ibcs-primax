package com.ibcs.idsdp.trainninginstitute.web.dto.request;

import com.ibcs.idsdp.common.model.domain.MinioAttachment;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PaymentVoucherRequest {
    private Integer serialNo;

    private MinioAttachment boucherImage;
}
