package com.ibcs.idsdp.model.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.persistence.*;
import java.util.List;

@Data
@Entity
public class Navigations {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Long id;
    private String title;
    private String titleBn;
    private String type;
    private String icon;
    private String link;
    private String menuId;
    private Integer orders;
    @JoinColumn
    @OneToOne
    private Navigations parent;
    @Transient
    @OneToMany(mappedBy = "parent")
    private List<Navigations> children;
    //@JsonBackReference
    @JoinColumn
    @OneToOne(cascade = CascadeType.REFRESH)
    private ApiEndpoints apiEndpoints;
}
