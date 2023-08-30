package com.ibcs.idsdp.services;

import com.ibcs.idsdp.model.domain.SessionData;
import com.ibcs.idsdp.model.repositories.SessionDataRepository;
import com.ibcs.idsdp.web.dto.request.SessionDataRequest;
import com.ibcs.idsdp.web.dto.response.SessionDataResponse;
import lombok.AllArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Created by : rakibul.hasan on 4/21/2022 2:13 PM
 * github : https://github.com/rhmtechno
 */
@Service
@AllArgsConstructor
public class SessionServiceImpl implements  SessionService {
    private final SessionDataRepository sessionDataRepository;

    @Override
    public SessionDataResponse saveSession(SessionDataRequest sessionDataRequest) {
        SessionData sessionData=new SessionData();
        BeanUtils.copyProperties(sessionDataRequest,sessionData);
        SessionData save = sessionDataRepository.save(sessionData);
        SessionDataResponse sessionDataResponse=new SessionDataResponse();
        BeanUtils.copyProperties(save,sessionDataResponse);
        return sessionDataResponse;
    }

    @Override
    public SessionDataResponse getSession(String sessionId) {
        Optional<SessionData> sessionData=sessionDataRepository.findBySessionId(sessionId);
        SessionDataResponse sessionDataResponse=new SessionDataResponse();
        if(sessionData.isPresent()){
            BeanUtils.copyProperties(sessionData.get(),sessionDataResponse);
            return sessionDataResponse;
        }
        return  sessionDataResponse;
    }

    @Override
    public String deleteSession(String sessionId) {
        Optional<SessionData> sessionData=sessionDataRepository.findBySessionId(sessionId);
        if(sessionData.isPresent()){
            sessionDataRepository.deleteBySessionId(sessionId);
            return "Session Id Deleted with id : "+sessionId;
        }
        return "Session Id Already Deleted Or Not Found with id : "+sessionId;
    }
}
