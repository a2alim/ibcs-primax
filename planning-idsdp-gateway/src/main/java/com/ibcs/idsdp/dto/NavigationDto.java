package com.ibcs.idsdp.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class NavigationDto {

    private String id;
    private String title;
    private String translate;
    private String type;
    private String url;
    private String link;
    private Integer orders;
    private String icon;
    private List<NavigationDto> children;



    public NavigationDto(String id, String title, String translate) {
        this.id = id;
        this.title = title;
        this.translate = translate;
    }



    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getTranslate() {
        return translate;
    }

    public void setTranslate(String translate) {
        this.translate = translate;
    }

    public String getType() {
        return type;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public void setType(String type) {
        this.type = type;
    }

    public List<NavigationDto> getChildren() {
        return children;
    }

    public void setChildren(List<NavigationDto> children) {
        this.children = children;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }
}
