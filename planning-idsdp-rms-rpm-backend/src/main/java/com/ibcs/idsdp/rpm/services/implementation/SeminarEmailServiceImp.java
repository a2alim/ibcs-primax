package com.ibcs.idsdp.rpm.services.implementation;

import com.ibcs.idsdp.rpm.model.domain.CreateSeminar;
import com.ibcs.idsdp.rpm.model.domain.SeminarEmail;
import com.ibcs.idsdp.rpm.model.repositories.CreateSeminarRepository;
import com.ibcs.idsdp.rpm.model.repositories.SeminarEmailRepository;
import com.ibcs.idsdp.rpm.services.SeminarEmailService;
import com.ibcs.idsdp.rpm.web.dto.request.SeminarEmailRequest;
import com.ibcs.idsdp.util.Response;
import lombok.AllArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Optional;

/**
 * @author moniruzzaman.rony
 * @create 11/23/21
 * @github `https://github.com/moniruzzamanrony`
 */

@Service
@AllArgsConstructor
public class SeminarEmailServiceImp implements SeminarEmailService {
    private SeminarEmailRepository seminarEmailRepository;
    private CreateSeminarRepository createSeminarRepository;

    @Transactional
    @Override
    public Response saveSeminarEmail(SeminarEmailRequest seminarEmailRequest) {
        SeminarEmail seminarEmail = new SeminarEmail();
        BeanUtils.copyProperties(seminarEmailRequest, seminarEmail);
        seminarEmail.setMailTo(seminarEmailRequest.getTo());
        seminarEmail.setBody(seminarEmailRequest.getMailBody());
        seminarEmailRepository.save(seminarEmail);

        Optional<CreateSeminar> createSeminarOptional = createSeminarRepository.findById(Long.valueOf(seminarEmailRequest.getSeminarId()));
        CreateSeminar createSeminar = createSeminarOptional.get();
        createSeminar.setMailSent(true);
        createSeminarRepository.save(createSeminar);

        Response<SeminarEmail> seminarEmailResponse = new Response<>();
        seminarEmailResponse.setMessage("Mail Sent");
        seminarEmailResponse.setObj(seminarEmail);
        seminarEmailResponse.setSuccess(true);
        return seminarEmailResponse;
    }
}
