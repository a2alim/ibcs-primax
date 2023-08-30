package com.ibcs.idsdp.common.utils;

import org.springframework.stereotype.Service;

import java.util.UUID;

/**
 * @author moniruzzaman.rony
 * @create 11/17/21
 * @github `https://github.com/moniruzzamanrony`
 */

@Service
public class AppUtils {

    public boolean isEmailChecked(String value){
        return value.contains("@");
    }
}
