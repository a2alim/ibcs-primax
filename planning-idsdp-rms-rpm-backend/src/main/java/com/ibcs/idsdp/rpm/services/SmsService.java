package com.ibcs.idsdp.rpm.services;


import com.ibcs.idsdp.rpm.web.dto.request.SmsDto;
import lombok.Data;
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
@PropertySource(value = "classpath:sms.properties")
@Data
public class SmsService {

    private final Environment environment;
    private final RestTemplate restTemplate;

    public SmsService(Environment environment, RestTemplate restTemplate) {
        this.environment = environment;
        this.restTemplate = restTemplate;
    }

    public Integer generateOtp() {
        Random random = new Random();
        return Integer.parseInt(String.format("%04d", random.nextInt(9999-1000)+1000));
    }

    public String getSmsApiText() {
        return environment.getProperty("sms.api.text", String.class);
    }


    public String getSmsApiUrl() {
        return environment.getProperty("sms.api.url", String.class);
    }


    public String getSmsApiUser() {
        return environment.getProperty("sms.api.user", String.class);
    }


    public String getSmsApiPassword() {
        return environment.getProperty("sms.api.password", String.class);
    }


    public Boolean getSmsApiEnable() {
        return environment.getProperty("sms.api.enable", Boolean.class);
    }


    public String sendSms(SmsDto smsdto) {
        String response = null;
        try {
            String url = this.getSmsApiUrl();
            String userName = this.getSmsApiUser();
            String Password = this.getSmsApiPassword();
            restTemplate.getMessageConverters().add(0, new StringHttpMessageConverter(StandardCharsets.UTF_8));
            HttpHeaders headers = new HttpHeaders();
            Charset utf8 = Charset.forName("UTF-8");
            MediaType mediaType = new MediaType("text", "html", utf8);
            headers.setContentType(mediaType);
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            headers.setAccept(Arrays.asList(MediaType.APPLICATION_FORM_URLENCODED));
            MultiValueMap<String, String> map = new LinkedMultiValueMap<String, String>();
            map.add("username", userName);
            map.add("password", Password);
            map.add("number", smsdto.getNumber());
            map.add("message", smsdto.getMessage());
            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<MultiValueMap<String, String>>(map,
                    headers);
            response = restTemplate.postForEntity(url, request, String.class).getBody();
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
        return response;
    }

}
