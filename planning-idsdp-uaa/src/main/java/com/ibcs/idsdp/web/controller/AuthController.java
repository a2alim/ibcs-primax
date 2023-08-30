package com.ibcs.idsdp.web.controller;


import com.ibcs.idsdp.annotations.ApiController;
import com.ibcs.idsdp.services.AuthService;
import com.ibcs.idsdp.web.dto.request.ChangePasswordRequestDto;
import com.ibcs.idsdp.web.dto.request.ResetPayload;
import com.ibcs.idsdp.web.dto.response.AuthUserTokenRequest;
import com.ibcs.idsdp.web.dto.response.AuthUserTokenResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import static com.ibcs.idsdp.constants.ApiConstants.EXTERNAL_MEDIA_TYPE;
import static com.ibcs.idsdp.constants.AuthApiConstants.*;

@ApiController
@AllArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * For Updating password when user forgets
     *
     * @param emailId
     * @return
     */
    @PutMapping(value = FORGET_PASSWORD_ENDPOINT + EMAIL_ID_VAR, produces = EXTERNAL_MEDIA_TYPE)
    public ResponseEntity<String> forgetPassword(@PathVariable(EMAIL_ID) String emailId) {
        return authService.forgetPassword(emailId);
    }

    @PutMapping(value = RESET_PASSWORD_ENDPOINT + PASSWORD_VAR, produces = EXTERNAL_MEDIA_TYPE)
    public ResponseEntity<String> resetPassword(@PathVariable(PASSWORD) String password,@RequestBody ResetPayload resetPayload) {
      return   authService.resetPassword(password,resetPayload);
    }

    /**
     * @param changePasswordRequestDto
     * @return
     */
    @PostMapping(value = PRIVATE_API_ENDPOINT + "/change-password", produces = EXTERNAL_MEDIA_TYPE)
    public ResponseEntity<String> changePasswordByOldPass(@RequestBody ChangePasswordRequestDto changePasswordRequestDto) {
        return authService.changePasswordByOldPass(changePasswordRequestDto);
    }

    /**
     * This service is for getting the access token by userName & password
     * @param request
     * @return
     */
    @PostMapping(value = PRIVATE_API_ENDPOINT + "/get-access-token")
    public ResponseEntity<AuthUserTokenResponse> getAccessToken(@RequestBody AuthUserTokenRequest request) {
        return authService.getAccessToken(request);
    }
}
