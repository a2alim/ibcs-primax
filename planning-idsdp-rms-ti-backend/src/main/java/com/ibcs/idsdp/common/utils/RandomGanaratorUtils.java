package com.ibcs.idsdp.common.utils;

import org.springframework.stereotype.Service;

import java.util.Random;
import java.util.UUID;

/**
 * @author moniruzzaman.rony
 * @create 11/17/21
 * @github `https://github.com/moniruzzamanrony`
 */

@Service
public class RandomGanaratorUtils {

    public String getUuid(){
        return UUID.randomUUID().toString();
    }

    public Integer getRandomOtpCode(){
        return new Random().nextInt(999999);
    }
}
