package com.ibcs.idsdp.web.controller;

import com.ibcs.idsdp.annotations.ApiController;
import com.ibcs.idsdp.services.SessionService;
import com.ibcs.idsdp.web.dto.request.SessionDataRequest;
import com.ibcs.idsdp.web.dto.response.SessionDataResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.ibcs.idsdp.constants.ApiConstants.EXTERNAL_MEDIA_TYPE;

/**
 * Created by : rakibul.hasan on 4/21/2022 2:07 PM
 * github : https://github.com/rhmtechno
 */
@ApiController
@AllArgsConstructor
public class SessionController {

    private final SessionService sessionService;

    @PostMapping(value = "/api/create-session", produces = EXTERNAL_MEDIA_TYPE)
    public ResponseEntity<SessionDataResponse> createSession(@RequestBody SessionDataRequest sessionDataRequest) {
        SessionDataResponse sessionDataResponse = sessionService.saveSession(sessionDataRequest);
        return new ResponseEntity<>(sessionDataResponse, HttpStatus.CREATED);
    }

    @GetMapping(value = "/api/get-token-by-session-id/{sessionId}", produces = EXTERNAL_MEDIA_TYPE)
    public ResponseEntity<SessionDataResponse> getSession(@PathVariable String sessionId) {
        SessionDataResponse sessionDataResponse = sessionService.getSession(sessionId);
        return new ResponseEntity<>(sessionDataResponse, HttpStatus.OK);
    }


    @DeleteMapping(value = "/api/delete-token-by-session-id/{sessionId}", produces = EXTERNAL_MEDIA_TYPE)
    public ResponseEntity<String> deleteSession(@PathVariable String sessionId) {
        String deleteResponse = sessionService.deleteSession(sessionId);
        return new ResponseEntity<>(deleteResponse, HttpStatus.OK);
    }




}
