package com.ibcs.idsdp.services;

import com.ibcs.idsdp.model.domain.User;
import com.ibcs.idsdp.model.domain.UserProfile;
import com.ibcs.idsdp.model.repositories.ImageDataRepository;
import com.ibcs.idsdp.model.repositories.UserProfileRepository;
import com.ibcs.idsdp.model.repositories.UserRepository;
import com.ibcs.idsdp.web.dto.request.ChangePasswordRequest;
import com.ibcs.idsdp.web.dto.request.LoggedUserDto;
import com.ibcs.idsdp.web.dto.request.UserProfileRequest;
import com.ibcs.idsdp.web.dto.response.UserProfileResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Optional;

@Service
public class UserProfileService {

    @Autowired
    ImageUploadService imageUploadService;

    @Autowired
    UserProfileRepository userProfileRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    UserRepository userRepository;

    @Autowired
    LoggedUserInfo loggedUserInfo;

    @Autowired
    ImageDataRepository imageDataRepository;

    @Transactional
    public UserProfile updateUserProfile(String accessToken, UserProfileRequest userProfileRequest) {

        try {
            LoggedUserDto loggedUser = loggedUserInfo.decodeJWTBody(accessToken);
            Long userId = Long.parseLong(loggedUser.getId());
            if (userId != null) {
            Optional<User> userOptional = userRepository.findById(userId);
            if (userOptional != null) {
                User user = userOptional.get();
                user.setName(userProfileRequest.getName());
                user.setMobileNumber(userProfileRequest.getMobileNo());
                userRepository.save(user);
            }
            UserProfile userProfile = userProfileRepository.findByUserId(userId);
            if (userProfile != null) {
                userProfile.setPresentAddress(userProfileRequest.getPresentAddress());
                userProfile.setPermanentAddress(userProfileRequest.getPermanentAddress());
                userProfile.setProfileImageUrl(userProfileRequest.getProfileImageUrl());
                userProfile.setSignatureImageUrl(userProfileRequest.getSignatureImageUrl());
                userProfileRepository.save(userProfile);
            } else {
                UserProfile newUser = new UserProfile();
                newUser.setUserId(userId);
                newUser.setPresentAddress(userProfileRequest.getPresentAddress());
                newUser.setPermanentAddress(userProfileRequest.getPermanentAddress());
                newUser.setProfileImageUrl(userProfileRequest.getProfileImageUrl());
                newUser.setSignatureImageUrl(userProfileRequest.getSignatureImageUrl());
                userProfileRepository.save(newUser);
            }
        }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }


    public ResponseEntity<String> changePassword(String accessToken, ChangePasswordRequest changePasswordRequest) {
        LoggedUserDto loggedUser = loggedUserInfo.decodeJWTBody(accessToken);
        Long userId = Long.parseLong(loggedUser.getId());
        if(userId != null) {
            Optional<User> userOptional = userRepository.findById(userId);
            User user = userOptional.get();
            if(encoder.matches(changePasswordRequest.getCurrentPassword(), user.getPassword())) {
                user.setPassword(encoder.encode(changePasswordRequest.getNewPassword()));
                userRepository.save(user);
                return new ResponseEntity("Updated", HttpStatus.OK);
            } else {
                return new ResponseEntity("Current Password not match", HttpStatus.NOT_ACCEPTABLE);
            }

        } else {
            return new ResponseEntity("User Not Found", HttpStatus.NOT_FOUND);

        }

    }

    public UserProfileResponse getUserProfileInfo(String accessToken) {
        try {
            LoggedUserDto loggedUser = loggedUserInfo.decodeJWTBody(accessToken);
            Long userId = Long.parseLong(loggedUser.getId());
            if(userId != null) {
                Optional<User> userOptional = userRepository.findById(userId);
                User user = userOptional.get();
                UserProfile userProfile = userProfileRepository.findByUserId(userId);
                if(userProfile != null) {
                    UserProfileResponse userProfileResponse = new UserProfileResponse();
                    userProfileResponse.setSignatureImageUrl(userProfile.getSignatureImageUrl());
                    userProfileResponse.setProfileImageUrl(userProfile.getProfileImageUrl());
                    userProfileResponse.setName(user.getName());
                    userProfileResponse.setMobileNumber(user.getMobileNumber());
                    userProfileResponse.setEmail(user.getEmailId());
                    userProfileResponse.setPresentAddress(userProfile.getPresentAddress());
                    userProfileResponse.setPermanentAddress(userProfile.getPermanentAddress());
                    userProfileResponse.setDesignation(user.getDesignation());
                    userProfileResponse.setOrganigationName(user.getOrganigationName());
                    userProfileResponse.setUserType(user.getUserType());
                    userProfileResponse.setUserId(user.getId());
                    return userProfileResponse;
                } else {
                    UserProfileResponse userProfileResponse = new UserProfileResponse();
                    userProfileResponse.setName(user.getName());
                    userProfileResponse.setMobileNumber(user.getMobileNumber());
                    userProfileResponse.setEmail(user.getEmailId());
                    userProfileResponse.setDesignation(user.getDesignation());
                    userProfileResponse.setOrganigationName(user.getOrganigationName());
                    userProfileResponse.setUserType(user.getUserType());
                    userProfileResponse.setUserId(user.getId());
                    return userProfileResponse;
                }
            } else {
                System.out.println("User Not Found");
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
       return null;
    }
}
