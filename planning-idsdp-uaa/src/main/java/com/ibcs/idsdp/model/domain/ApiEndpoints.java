package com.ibcs.idsdp.model.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.persistence.*;
import java.util.List;

@Data
@Entity
public class ApiEndpoints {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Long id;

    private String name;

    @JoinColumn(name="permission_id")
    @OneToOne(cascade = CascadeType.REFRESH)
    private Permission permission;

    @Column(name="type")
    private String methodType;

    @OneToOne
    @JoinColumn(name="url")
    private Urls endpointUrl;

    private String apiType;

    @OneToOne(cascade = CascadeType.REFRESH)
    private SubModule subModule;

    @Column(columnDefinition = "boolean default false")
    private Boolean isDelete;

    @JsonIgnore
    @OneToMany(mappedBy = "apiEndpoints", cascade = CascadeType.REFRESH, fetch = FetchType.EAGER)
    private List<Navigation> navigations;

}
