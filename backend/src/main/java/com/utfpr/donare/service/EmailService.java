package com.utfpr.donare.service;

import com.utfpr.donare.dto.EmailRequestDTO;
import com.utfpr.donare.email.EmailTemplateLoader;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final EmailTemplateLoader templateLoader;

    public EmailService(JavaMailSender mailSender, EmailTemplateLoader templateLoader) {
        this.mailSender = mailSender;
        this.templateLoader = templateLoader;
    }

    public void sendEmail(EmailRequestDTO request) throws Exception {

        String templateName = request.getEmailType().name().toLowerCase();
        Map<String, String> variables = request.getVariables();

        EmailTemplateLoader.EmailTemplate template = templateLoader.loadTemplate(templateName, variables);

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setTo(request.getEmail());
        helper.setSubject(template.subject());
        helper.setText(template.body(), true);

        mailSender.send(message);
    }
}
