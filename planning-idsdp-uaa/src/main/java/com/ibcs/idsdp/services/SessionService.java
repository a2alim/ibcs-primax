package com.ibcs.idsdp.services;

import com.ibcs.idsdp.web.dto.request.SessionDataRequest;
import com.ibcs.idsdp.web.dto.response.SessionDataResponse;

/**
 * Created by : rakibul.hasan on 4/21/2022 2:13 PM
 * github : https://github.com/rhmtechno
 */

public interface SessionService {
    SessionDataResponse saveSession(SessionDataRequest sessionDataRequest);

    SessionDataResponse getSession(String sessionId);

    String deleteSession(String sessionId);
}
