package com.ibcs.idsdp.config.utils;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.text.SimpleDateFormat;

public interface CommonFunctions {
    default <T> T objectMapperReadValue(String content, Class<T> valueType) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {

            return objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false).readValue(content,
                    valueType);

        } catch (JsonParseException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            return null;
        } catch (JsonMappingException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            return null;
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            return null;
        }
        // return null;
    }

    default String objectToJson(Object content) {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.setDateFormat(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.S"));

        try {
            return objectMapper.writeValueAsString(content);

        } catch (JsonParseException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            return null;
        } catch (JsonMappingException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            return null;
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            return null;
        }
        // return null;
    }
}
