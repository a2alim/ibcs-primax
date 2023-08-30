package com.ibcs.idsdp.trainninginstitute.services;

import com.ibcs.idsdp.trainninginstitute.web.dto.request.ParticipantLoginRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.SendOTPRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ApiMessageResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ParticipantLoginResponse;
import org.springframework.http.ResponseEntity;

/**
 * @author moniruzzaman.rony
 * @create 1/8/22
 * @github `https://github.com/moniruzzamanrony`
 */
public interface ParticipantLoginService {
    ResponseEntity<ApiMessageResponse> sendOTPParticipant(SendOTPRequest sendOTPRequest);

    ResponseEntity<ParticipantLoginResponse> loginParticipant(ParticipantLoginRequest participantLoginRequest);
}
