package com.ibcs.idsdp.dpptapp.web.dto;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import java.time.LocalDate;
import java.util.Date;

@Data
public class LogFrameDTO extends UuidIdHolderRequestBodyDTO {

    @NotBlank
    private LocalDate plannedDate;
    @NotBlank
    private LocalDate dateOfLogFrame;
    private Long projectConceptMasterId;
    private String projectConceptUuid;
    private Long dppMasterId;
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

}
