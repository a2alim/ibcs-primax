package com.ibcs.idsdp.domain;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
public class Navigation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String navId;
    private String title;
    private String translate;
    private String type;
    private String url;
    private String icon;
    private String menuNavId;
    private String subMenuNavId;
    @JoinColumn
    @OneToOne(cascade = CascadeType.REFRESH)
    private ApiEndpoints apiEndpoints;
    //private List<Navigation> children;



//    public Navigation(String id, String title, String translate) {
//        this.id = id;
//        this.title = title;
//        this.translate = translate;
//    }


}
