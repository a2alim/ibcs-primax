package com.ibcs.idsdp.domain;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;
import java.util.List;
import java.util.Set;

@Data
@Entity
public class Navigations {
    @Id
    //@JsonIgnore
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
    @JsonBackReference
    @JoinColumn
    @OneToOne(cascade = CascadeType.REFRESH)
    private ApiEndpoints apiEndpoints;
}
