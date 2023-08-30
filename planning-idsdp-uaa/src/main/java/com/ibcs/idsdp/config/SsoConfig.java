package com.ibcs.idsdp.config;

import com.ibcs.idsdp.model.domain.EmployeeInfo;
import com.ibcs.idsdp.model.domain.ExtractData;
import com.ibcs.idsdp.model.domain.OfficeInfo;
import com.ibcs.idsdp.model.domain.UserData;
import com.ibcs.idsdp.web.dto.SsoUser;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.Serializable;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.util.CollectionUtils;


@Configuration
public class SsoConfig implements Serializable {
    @Value("${config.oauth2.clientSecret}")
    private String clientSecret;
    @Value("${config.oauth2.privateKey}")
    private String privateKey;
    @Value("${config.oauth2.publicKey}")
    private String publicKey;


    //generate token for doptor user
    public String generateToken(UserDetails userDetails, SsoUser ssoUser) throws Exception {
        Map<String, Object> claims = new HashMap<>();

        if(ssoUser.getUserData()==null)
            throw new Exception("User Information Not Found From Ek-sheba");
        if(ssoUser.getUserData().getEmployee_info()==null)
            throw new Exception("Employee Information Not Found From Ek-sheba");
        if(CollectionUtils.isEmpty(ssoUser.getUserData().getOffice_info()))
            throw new Exception("Office Information Not Found From Ek-sheba");

        claims.put("user_id", userDetails.getUsername());
        claims.put("employee_record_id", ssoUser.getUserData().getEmployee_info().getId());
        claims.put("office_id",ssoUser.getUserData().getOffice_info().get(0).getOffice_id());
        claims.put("designation",ssoUser.getUserData().getOffice_info().get(0).getDesignation());
        claims.put("office_unit_organogram_id",ssoUser.getUserData().getOffice_info().get(0).getOffice_unit_organogram_id());

        return doGenerateToken(claims, userDetails.getUsername());
    }

    private String doGenerateToken(Map<String, Object> claims, String subject) {
        return Jwts.builder().setClaims(claims).setSubject(subject).setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 12 * 60 * 60 * 1000))
                .signWith(SignatureAlgorithm.HS512, clientSecret).compact();

    }

    private Claims getAllClaimsFromToken(String token) {
        return Jwts.parser().setSigningKey(clientSecret).parseClaimsJws(token).getBody();
    }

    public Claims extractToken(String token){
        Claims claims = getAllClaimsFromToken(token);
        return claims;
    }

    public ExtractData getSsoUser(String token){
        Claims claims = extractToken(token);
        EmployeeInfo employeeInfo = new EmployeeInfo();
        employeeInfo.setId(Integer.parseInt(claims.get("employee_record_id").toString()));
        OfficeInfo officeInfo = new OfficeInfo();
        officeInfo.setOffice_id(Integer.parseInt(claims.get("office_id").toString()));
        officeInfo.setDesignation(claims.get("designation").toString());
        officeInfo.setOffice_unit_organogram_id(Integer.parseInt(claims.get("office_unit_organogram_id").toString()));
        ExtractData userData = new ExtractData();
        userData.setEmployee_info(employeeInfo);
        userData.setOffice_info(Arrays.asList(officeInfo));
        userData.setUser_id(claims.get("user_id").toString());
        return userData;
    }



}
