package com.ibcs.idsdp.services;

import org.springframework.stereotype.Service;

import javax.mail.*;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.Properties;

@Service
public class MailService {

    private static final String USERNAME = "itvillage29@gmail.com";
    private static final String PASSWORD = "";

    /**
     *
     * For Mail
     */
    public boolean sendEmail(String emailId, String subject, String body) throws AddressException, MessagingException {
        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "587");

        Session session = Session.getInstance(props,
                new javax.mail.Authenticator() {
                    protected PasswordAuthentication getPasswordAuthentication() {
                        return new PasswordAuthentication(USERNAME, PASSWORD);
                    }
                });

        MimeMessage message = new MimeMessage(session);
        message.setFrom(new InternetAddress(USERNAME));
        message.addRecipient(Message.RecipientType.TO, new InternetAddress(emailId));
        message.setSubject(subject);
        message.setText("Please follow the link for change default password: " + body);
        Transport.send(message);
        return true;
    }
}
