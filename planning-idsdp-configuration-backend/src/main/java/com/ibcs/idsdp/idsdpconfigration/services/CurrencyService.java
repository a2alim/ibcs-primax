package com.ibcs.idsdp.idsdpconfigration.services;

import com.ibcs.idsdp.idsdpconfigration.web.dto.request.DivisionRequest;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface CurrencyService {

    String generateCodeNumber(String versionNameEn);
}
