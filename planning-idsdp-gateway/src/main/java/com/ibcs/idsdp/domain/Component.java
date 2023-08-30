package com.ibcs.idsdp.domain;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Id;

@Data
@Entity
public class Component {
    @Id
    private Long id;
    private String name;
}
