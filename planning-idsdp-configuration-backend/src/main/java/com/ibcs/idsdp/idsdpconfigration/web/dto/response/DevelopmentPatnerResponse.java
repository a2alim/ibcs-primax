package com.ibcs.idsdp.idsdpconfigration.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidHolderRequestBodyDTO;
import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DevelopmentPatnerResponse extends UuidHolderRequestBodyDTO {

    private Long id;
    private String code;
    private String developmentPartnerName;
    private String developmentPartnerNameBng;
    private String description;
    private Boolean status;
}
