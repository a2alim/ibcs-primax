package com.ibcs.idsdp.trainninginstitute.web.controller;

import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.trainninginstitute.model.domain.ParticipantModel;
import com.ibcs.idsdp.trainninginstitute.model.domain.ProposalModel;
import com.ibcs.idsdp.trainninginstitute.services.ParticipantLoginService;
import com.ibcs.idsdp.trainninginstitute.services.ParticipantService;
import com.ibcs.idsdp.trainninginstitute.services.ProposalService;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.ParticipantLoginRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.ParticipantRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.SendOTPRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.*;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestApiController
@AllArgsConstructor
@RequestMapping("/public/participants")
public class ParticipantLoginController {
	
    private final ParticipantLoginService participantService;
    private final ProposalService proposalService;
    @PostMapping("/login")
    public ResponseEntity<ParticipantLoginResponse> loginParticipant(
            @RequestBody ParticipantLoginRequest participantLoginRequest) {
        return participantService.loginParticipant(participantLoginRequest);
    }

    @PostMapping("/otp/send")
    public ResponseEntity<ApiMessageResponse> sendOTPParticipant(@RequestBody SendOTPRequest sendOTPRequest) {
        return participantService.sendOTPParticipant(sendOTPRequest);
    }

    @GetMapping("/{participantId}")
    public ResponseEntity<List<ProposalModel>> getAllProposalByParticipant(@PathVariable Long participantId){
        return proposalService.getAllProposalByParticipant(participantId);
    }
}
