package com.ibcs.idsdp.dto;

import lombok.Data;

import java.util.List;

@Data
public class TokenDetails {
    private String user_name;
    private boolean active;
    private List<String> authorities;
}
