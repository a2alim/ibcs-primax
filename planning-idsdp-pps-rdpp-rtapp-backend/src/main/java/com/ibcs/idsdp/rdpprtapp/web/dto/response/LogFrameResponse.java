package com.ibcs.idsdp.rdpprtapp.web.dto.response;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import java.time.LocalDate;

@Data
public class LogFrameResponse {
    @NotBlank
    private LocalDate dateOfLogFrame;
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
    private String uuid;

}
