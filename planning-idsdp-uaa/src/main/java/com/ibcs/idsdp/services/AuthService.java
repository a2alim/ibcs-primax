package com.ibcs.idsdp.services;

import com.ibcs.idsdp.client.RmsMailService;
import com.ibcs.idsdp.model.domain.User;
import com.ibcs.idsdp.model.repositories.UserRepository;
import com.ibcs.idsdp.web.dto.request.ChangePasswordRequestDto;
import com.ibcs.idsdp.web.dto.request.MailRequestDto;
import com.ibcs.idsdp.web.dto.request.ResetPayload;
import com.ibcs.idsdp.web.dto.response.AuthUserTokenRequest;
import com.ibcs.idsdp.web.dto.response.AuthUserTokenResponse;
import com.ibcs.idsdp.web.dto.response.MailResponseDto;
import org.apache.commons.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Optional;

@Service
public class AuthService {
    private final RmsMailService rmsMailService;
    private final MailService mailService;
    private final UserRepository userRepository;

    @Value("${idsdp.frontend.host}")
    private String hostAddress;

    @Value("${idsdp.frontend.verification.link}")
    private String verificationLink;

    @Value("${uaa.login.url}")
    private String uaaLogin;

    @Autowired
    private PasswordEncoder encoder;

    public AuthService(RmsMailService rmsMailService, MailService mailService, UserRepository userRepository) {
        this.rmsMailService = rmsMailService;
        this.mailService = mailService;
        this.userRepository = userRepository;
    }

    /**
     * For forget password
     *
     * @param emailId
     * @return
     */
    public ResponseEntity<String> forgetPassword(String emailId) {


        User optionalUser = userRepository.findByEmailIdAndIsActive(emailId,true);

        if (optionalUser == null) {
            return new ResponseEntity("User Not Found", HttpStatus.NOT_FOUND);
        }
        try {
            long validity = System.currentTimeMillis();
            MailRequestDto requestDto = new MailRequestDto();
            requestDto.setBody(hostAddress + "reset-password/" + optionalUser.getUserId() + "/" + validity);
            requestDto.setTo(optionalUser.getEmailId());
            requestDto.setFrom("ssrc.gov.bd@gmail.com");
            requestDto.setSubject("Forgot Password");
            requestDto.setTemplateName("forgot-template");
            requestDto.setIsAttachment(false);
            requestDto.setAttachmentUrl("");
            requestDto.setAttachmentName("");
            //mailService.sendEmail(emailId, "Reset Password @IDSDP", "Reset password via this url :" + verificationLink + optionalUser.getUserId());
            MailResponseDto response = rmsMailService.sendMail(requestDto);
            return new ResponseEntity(response.getMessage(), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity("Something Wrong", HttpStatus.BAD_GATEWAY);
        }

    }

    /**
     * @param changePasswordRequestDto
     * @return
     */
    public ResponseEntity<String> changePasswordByOldPass(ChangePasswordRequestDto changePasswordRequestDto) {

        Optional<User> userOpt = userRepository.findById(changePasswordRequestDto.getId());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (encoder.matches(changePasswordRequestDto.getOldPassword(), user.getPassword())) {
                user.setPassword(encoder.encode(changePasswordRequestDto.getNewPassword()));
                userRepository.save(user);
                return new ResponseEntity("Your Password Successfully Changed. Please Re-Login to Continue", HttpStatus.OK);
            } else {
                return new ResponseEntity("Your credentials does not match. Please try again!", HttpStatus.NOT_ACCEPTABLE);
            }
        } else {
            return new ResponseEntity("User Not Found", HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<String> resetPassword(String password, ResetPayload resetPayload) {

        //check validity
        long currentTime = System.currentTimeMillis();
        long generatedTime = Long.parseLong(resetPayload.getValidity());

        if (currentTime - generatedTime > 600000) {
            return new ResponseEntity<>("Validation Link Expired!!", HttpStatus.FORBIDDEN);
        }

        User user = userRepository.findByUserId(resetPayload.getUserId());
        if (user == null) {
            return new ResponseEntity<>("User Not Found!!", HttpStatus.NOT_FOUND);
        }

        String encodedPassword = encoder.encode(password);
        user.setPassword(encodedPassword);
        userRepository.save(user);
        return new ResponseEntity<>("User Not Found!!", HttpStatus.OK);
    }

    public ResponseEntity<AuthUserTokenResponse> getAccessToken(AuthUserTokenRequest authRequest) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        MultiValueMap<String, String> map = new LinkedMultiValueMap<>();

        // Basic Auth
        String plainCreds = "ibcsplanningidsdp" + ":" + "planningIdsdpsha$@#929%";
        byte[] plainCredsBytes = plainCreds.getBytes();
        byte[] base64CredsBytes = Base64.encodeBase64(plainCredsBytes);
        String base64Creds = new String(base64CredsBytes);
        headers.add("Authorization", "Basic " + base64Creds);

        // params
        map.add("username", authRequest.getUserName());
        map.add("password", authRequest.getPassword());
        map.add("grant_type", "password");
        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<MultiValueMap<String, String>>(map, headers);
        HttpEntity<?> requestEntity = new HttpEntity<>(map, headers);
        ResponseEntity<AuthUserTokenResponse> responseEntity = restTemplate.postForEntity(uaaLogin, requestEntity, AuthUserTokenResponse.class);

        return responseEntity;
    }
}
