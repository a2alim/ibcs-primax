package com.ibcs.idsdp.model.domain;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

@Data
@NoArgsConstructor
@Entity
public class SubModule {
    @Id
    private Long id;
    private String name;
    @ManyToOne
    private Module module;

    public SubModule(Long id) {
        this.id = id;
    }

}
