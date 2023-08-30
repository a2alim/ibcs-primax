package com.ibcs.idsdp.rpm.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

/**
 * Rakibul Hasan
 */
@Data
public class PublicationInfoRequest {
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
