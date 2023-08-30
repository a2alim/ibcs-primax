package com.ibcs.idsdp.web.controller;

import com.ibcs.idsdp.annotations.ApiController;
import com.ibcs.idsdp.model.domain.UserProfile;
import com.ibcs.idsdp.services.UserProfileService;
import com.ibcs.idsdp.web.dto.request.ChangePasswordRequest;
import com.ibcs.idsdp.web.dto.request.UserProfileRequest;
import com.ibcs.idsdp.web.dto.response.UserProfileResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.ibcs.idsdp.constants.ApiConstants.*;
import static com.ibcs.idsdp.constants.UserProfileApiConstants.*;

@ApiController
@AllArgsConstructor
public class UserProfileController {

   private final UserProfileService userProfileService;

    /**
     * For editing update Profile
     * @param accessToken
     * @param userProfileRequest
     * @return
     */
    @PutMapping(value = UPDATE_PROFILE_ENDPOINT , produces = EXTERNAL_MEDIA_TYPE)
    public ResponseEntity<UserProfile> updateProfile(
            @RequestHeader(value = "Authorization") String accessToken,
            @RequestBody UserProfileRequest userProfileRequest) {

        if(!accessToken.isEmpty()) {
            UserProfile userProfile = userProfileService
                    .updateUserProfile(accessToken, userProfileRequest);
            return new ResponseEntity<>(userProfile, HttpStatus.OK);
        } else {
            return new ResponseEntity("Invalid Token", HttpStatus.UNAUTHORIZED);
        }
    }

    /**
     * For getting User Profile Info
     * @param accessToken
     * @return
     */
    @GetMapping(value = GET_USER_PROFILE_INFO, produces = EXTERNAL_MEDIA_TYPE)
    public ResponseEntity<UserProfile> getUserProfileInfo(@RequestHeader(value = "Authorization") String accessToken) {
        if(!accessToken.isEmpty()) {
            UserProfileResponse userProfileResponse = userProfileService.getUserProfileInfo(accessToken);
            return new ResponseEntity(userProfileResponse, HttpStatus.OK);
        } else {
            return new ResponseEntity("Invalid Token", HttpStatus.UNAUTHORIZED);
        }
    }

    /**
     * For Saving change password
     * @param accessToken
     * @param changePasswordRequest
     * @return
     */
    @PostMapping(value = CHANGE_PASSWORD, produces = EXTERNAL_MEDIA_TYPE)
    public ResponseEntity<?> changePassword(@RequestHeader(value = "Authorization") String accessToken,
                                            @RequestBody ChangePasswordRequest changePasswordRequest) {
        if (!accessToken.isEmpty()) {
            Object name = userProfileService.changePassword(accessToken, changePasswordRequest);
            return new ResponseEntity<>(name, HttpStatus.OK);
        } else {
            return new ResponseEntity("Invalid Token", HttpStatus.UNAUTHORIZED);
        }
    }
}
