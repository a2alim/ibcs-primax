package com.ibcs.idsdp.model.domain;

import lombok.Data;

import javax.persistence.*;

@Entity
@Data
public class Urls {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Long id;
    @Column(unique = true)
    private String url;
    private boolean assigned;

    public Urls() {
    }

    public Urls(Long id) {
        this.id = id;
    }
}
