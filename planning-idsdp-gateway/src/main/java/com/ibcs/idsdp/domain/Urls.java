package com.ibcs.idsdp.domain;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
@Data
public class Urls {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Long id;
    private String url;
    private boolean assigned;

    public Urls() {
    }

    public Urls(Long id) {
        this.id = id;
    }
}
