package com.ibcs.idsdp.trainninginstitute.services.implementation;

import com.ibcs.idsdp.common.utils.AppUtils;
import com.ibcs.idsdp.common.utils.RandomGanaratorUtils;
import com.ibcs.idsdp.config.exceptions.exception.ForbiddenException;
import com.ibcs.idsdp.trainninginstitute.client.SmsClientService;
import com.ibcs.idsdp.trainninginstitute.client.dto.response.SmsDto;
import com.ibcs.idsdp.trainninginstitute.model.domain.ParticipantModel;
import com.ibcs.idsdp.trainninginstitute.model.repositories.ParticipantRepository;
import com.ibcs.idsdp.trainninginstitute.services.ParticipantLoginService;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.ParticipantLoginRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.SendOTPRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ApiMessageResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ParticipantLoginResponse;
import com.ibcs.idsdp.util.Response;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Optional;

/**
 * @author moniruzzaman.rony
 * @create 1/8/22
 * @github `https://github.com/moniruzzamanrony`
 */

@AllArgsConstructor
@Transactional
@Service
public class ParticipantLoginServiceImp implements ParticipantLoginService {

    private final ParticipantRepository participantRepository;
    private final AppUtils appUtils;
    private final RandomGanaratorUtils randomGanaratorUtils;
    private final SmsClientService smsClientService;

    @Override
    public ResponseEntity<ApiMessageResponse> sendOTPParticipant(SendOTPRequest sendOTPRequest) {
        Optional<ParticipantModel> participantModelOptional;
        ApiMessageResponse apiMessageResponse = new ApiMessageResponse();
        Integer optCode = randomGanaratorUtils.getRandomOtpCode();
        try {
            if (!appUtils.isEmailChecked(sendOTPRequest.getMobileNumberOrEmail())) {
                participantModelOptional = participantRepository.findAllByPhoneNoAndFiscalYearId(sendOTPRequest.getMobileNumberOrEmail(), sendOTPRequest.getFiscalYearId());
                if (participantModelOptional.isEmpty()) {
                    System.out.println("You are not Participant");
                    apiMessageResponse.setMessage("You are not Participant");
                    apiMessageResponse.setStatusCode(404);
                    return new ResponseEntity(apiMessageResponse, HttpStatus.OK);
                } else {
                    sendOTPViaPhoneNo(sendOTPRequest, optCode, participantModelOptional.get());

                }
            } else {
                participantModelOptional = participantRepository.findAllByEmailAndFiscalYearId(sendOTPRequest.getMobileNumberOrEmail(), sendOTPRequest.getFiscalYearId());
                if (participantModelOptional.isEmpty()) {
                    System.out.println("You are not Participant");
                    apiMessageResponse.setMessage("You are not Participant");
                    apiMessageResponse.setStatusCode(404);
                    return new ResponseEntity(apiMessageResponse, HttpStatus.OK);
                } else {
                    sendOTPViaMail(sendOTPRequest, optCode, participantModelOptional.get());
                }
            }

            apiMessageResponse.setMessage("Send OTP");
            apiMessageResponse.setStatusCode(200);
            apiMessageResponse.setMessage("OTP Send successfully");
        } catch (Exception e) {
            apiMessageResponse.setMessage("Send not OTP ");
            apiMessageResponse.setStatusCode(404);
            apiMessageResponse.setMessage(e.getMessage());
        }
        return new ResponseEntity(apiMessageResponse, HttpStatus.OK);
    }

    private void sendOTPViaMail(SendOTPRequest sendOTPRequest, Integer optCode, ParticipantModel participantModel) {
        participantModel.setOtpCode(optCode);
        participantRepository.save(participantModel);
    }

    private void sendOTPViaPhoneNo(SendOTPRequest sendOTPRequest, Integer optCode, ParticipantModel participantModel) {
        SmsDto smsDto = new SmsDto();
        smsDto.setNumber(sendOTPRequest.getMobileNumberOrEmail());
        smsDto.setMessage("Your OTP Code : "+optCode);
        Response response = smsClientService.sendSms(smsDto);
       if(response.isSuccess())
       {
           participantModel.setOtpCode(optCode);
           participantRepository.save(participantModel);
       }else{
           throw new RuntimeException("Sms Not Sent");
       }

    }

    @Override
    public ResponseEntity<ParticipantLoginResponse> loginParticipant(ParticipantLoginRequest participantLoginRequest) {
        ParticipantLoginResponse participantLoginResponse = new ParticipantLoginResponse();
        if(participantLoginRequest.getOtpCode() != null) {
            Optional<ParticipantModel> participantModelOptional = participantRepository.findAllByOtpCode(participantLoginRequest.getOtpCode());
            ParticipantModel participantModel = participantModelOptional.get();
            if (!participantModelOptional.isEmpty()) {
                participantLoginResponse.setParticipantId(participantModel.getId());
            } else {
                throw new ForbiddenException("Invalid User");
            }

            participantModel.setOtpCode(null);
            participantRepository.save(participantModel);
        }else{
            throw new ForbiddenException("Invalid User");
        }
        return new ResponseEntity(participantLoginResponse, HttpStatus.OK);
    }
}
