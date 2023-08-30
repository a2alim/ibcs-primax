package com.ibcs.idsdp.rpm.services.implementation;

import com.ibcs.idsdp.rpm.services.MailService;
import com.ibcs.idsdp.rpm.web.dto.request.MailRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.MailResponseDto;
import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.ui.freemarker.FreeMarkerTemplateUtils;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by : rakibul.hasan on 12/9/2021 12:12 PM
 * github : https://github.com/rhmtechno
 */
@Service
public class MailServiceImpl implements MailService {

    @Autowired
    private JavaMailSender sender;
    @Autowired
    private Configuration config;


    @Value("${spring.mail.username}")
    private String fromEmail;


    @Override
    public MailResponseDto sendMail(MailRequestDto request) {
        MailResponseDto response = new MailResponseDto();
        MimeMessage message = sender.createMimeMessage();

        Map<String, Object> model = new HashMap<>();
        model.put("body", request.getBody());

        try {
            // set MediaType
            MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    StandardCharsets.UTF_8.name());
            if (Boolean.TRUE.equals(request.getIsAttachment())) {
                // Add Attachment
                helper.addAttachment(request.getAttachmentName(), new File(request.getAttachmentUrl()));
            }
            Template temp = config.getTemplate(request.getTemplateName() + ".ftl");
            String html = FreeMarkerTemplateUtils.processTemplateIntoString(temp, model);

            helper.setTo(request.getTo().split(","));
            helper.setFrom("SSRC<" + fromEmail + ">");
            helper.setSubject(request.getSubject());
            helper.setText(html, true);
            sender.send(message);
            response.setMessage("Mail Send to : " + request.getTo());
            response.setStatus(Boolean.TRUE);

        } catch (MessagingException | IOException | TemplateException e) {
            response.setMessage("Mail Sending Failure : " + e.getMessage());
            response.setStatus(Boolean.FALSE);
        }

        return response;
    }
}
