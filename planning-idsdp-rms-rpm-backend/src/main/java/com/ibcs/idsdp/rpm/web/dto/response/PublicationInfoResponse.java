package com.ibcs.idsdp.rpm.web.dto.response;

import lombok.Data;

@Data
public class PublicationInfoResponse {
    long profilePersonalInfoId;
    String publishedIn;
    String articleTitle;
    String roleInTeam;
    Long journalPaperNature;
    String publicationDate;
    String issn;
    String isbn;
    String uploadRelevantDoc;
    boolean isEditable;

}
