package com.ibcs.idsdp.dpptapp.web.dto.amsDTO;

import lombok.Data;

import java.util.List;


@Data
public class AmsGreenPageResponseDTO {
    private int response_code;
    private List<AmsGreenPageDTO> data;
}
