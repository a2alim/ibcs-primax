package com.ibcs.idsdp.rmsConfigration.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class StProposalMarksSetupResponseDto extends UuidIdHolderRequestBodyDTO {

    private int stFiscalYearId;

    private String fieldOfAssessment;

    private int fieldNo1;

    private int fieldNo2;

    private int fieldNo3;

    private int fieldNo4;

    private int fieldNo5;

    private int fieldNo6;

    private int fieldNo7;

    private int fieldNo8;

    private int fieldNo9;

    private int fieldNo10;
}
