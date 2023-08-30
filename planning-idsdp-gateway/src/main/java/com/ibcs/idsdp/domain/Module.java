package com.ibcs.idsdp.domain;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

@Data
@Entity
public class Module {
    @Id
    private Long id;
    private String name;
    @ManyToOne
    private Component component;
}
