package com.ibcs.idsdp.utils;

import com.ibcs.idsdp.web.dto.request.PageableRequestBodyDTO;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public class Utils {

    private static final int DEFAULT_PAGE_SIZE = 1000000;

    /**
     * For generating generate Unique Key
     *
     * @return String
     */
    public static String generateUniqueKey() {
        return new DigestUtils("SHA3-256").digestAsHex(UUID.randomUUID().toString());
    }

    public static Pageable getPageable(PageableRequestBodyDTO requestDTO) {
        PageableRequestBodyDTO pageSettings = new PageableRequestBodyDTO() {{
            setPage(0);
            setSize(DEFAULT_PAGE_SIZE);
        }};
        if (requestDTO != null && requestDTO.getPage() != null && requestDTO.getSize() != null) {
            pageSettings = requestDTO;
        }
        return PageRequest.of(pageSettings.getPage(), pageSettings.getSize());
    }

}
