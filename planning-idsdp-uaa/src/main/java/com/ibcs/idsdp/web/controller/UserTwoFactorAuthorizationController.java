package com.ibcs.idsdp.web.controller;

import com.ibcs.idsdp.annotations.ApiController;
import com.ibcs.idsdp.model.repositories.UserRepository;
import com.ibcs.idsdp.services.UserService;
import com.ibcs.idsdp.web.dto.UserTfaDto;
import com.ibcs.idsdp.web.dto.request.UserTfaRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Map;

import static com.ibcs.idsdp.constants.ApiConstants.EXTERNAL_MEDIA_TYPE;
import static com.ibcs.idsdp.constants.UserApiConstants.ALL_USER_ID_WITH_TFA_ENABLED_OR_NOT_ENDPOINT;
import static com.ibcs.idsdp.constants.UserApiConstants.UPDATE_TFA_ENABLED;

@ApiController
public class UserTwoFactorAuthorizationController {

    @Autowired
    UserRepository userRepository;
    @Autowired
    UserService userService;

    /**
     * For getting all users
     * @return
     */
    @GetMapping(value= ALL_USER_ID_WITH_TFA_ENABLED_OR_NOT_ENDPOINT)
    public ResponseEntity<List<UserTfaDto>> tfaAllUsers(){
        return userService.getAllUser();
    }

    /**
     * For updating TfaEnable
     * @param userTfaRequest
     * @return
     */
    @PutMapping(value= UPDATE_TFA_ENABLED, produces = EXTERNAL_MEDIA_TYPE)
    public ResponseEntity<String> updateTfaEnable(@RequestBody UserTfaRequest userTfaRequest){
        return userService.update2faEnabled(userTfaRequest);
    }



}
