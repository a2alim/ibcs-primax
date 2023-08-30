package com.ibcs.idsdp.rpm.services;

import com.ibcs.idsdp.rpm.web.dto.request.LatterRequest;
import com.ibcs.idsdp.util.Response;

/**
 * @author moniruzzaman.rony
 * @create 10/21/21
 * @github `https://github.com/moniruzzamanrony`
 */
public interface LatterService {
    Response saveLatter(LatterRequest latterRequest);

    Response getLatter();
    Response getLatterList(Long catId);

    Response getLetterById(Long id);
    
    Response getLetterDetailsById(Long id);

    Response deleteLatter(Long id);

    Response updateLetter(Long id, LatterRequest latterRequest);
}
