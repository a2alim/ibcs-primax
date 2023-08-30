package com.ibcs.idsdp.dpptapp.web.dto;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class TappLogFrameDTO extends UuidIdHolderRequestBodyDTO {

    private String pcUuid;
    private Long pcMasterId;
    private String goalNS;
    private String goalOVI;
    private String goalMOV;
    private String objectiveNS;
    private String objectiveOVI;
    private String objectiveMOV;
    private String objectiveIA;
    private String outputNS;
    private String outputOVI;
    private String outputMOV;
    private String outputIA;
    private String inputNS;
    private String inputOVI;
    private String inputMOV;
    private String inputIA;
    private Long tappMasterId;

}
