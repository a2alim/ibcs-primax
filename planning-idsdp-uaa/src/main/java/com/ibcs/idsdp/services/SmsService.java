package com.ibcs.idsdp.services;

import com.ibcs.idsdp.web.dto.request.SmsDto;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Random;

/**
 * Created by : rakibul.hasan on 12/20/2021 10:55 AM
 * github : https://github.com/rhmtechno
 */
@Service
@Data
@RequiredArgsConstructor
public class SmsService {

    public Integer generateOtp() {
        Random random = new Random();
        return Integer.parseInt(String.format("%04d", random.nextInt(9999-1000)+1000));
    }





}
