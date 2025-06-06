package com.utfpr.donare.email;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.w3c.dom.Document;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@Component
public class EmailTemplateLoader {

    public record EmailTemplate(String subject, String body) {}

    public EmailTemplate loadTemplate(String templateName, Map<String, String> variables) throws IOException {

        ClassPathResource resource = new ClassPathResource("mail-templates/" + templateName + ".xml");
        String xmlContent = new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);

        for (Map.Entry<String, String> entry : variables.entrySet()) {
            xmlContent = xmlContent.replace("{{" + entry.getKey() + "}}", entry.getValue());
        }

        try {

            DocumentBuilder builder = DocumentBuilderFactory.newInstance().newDocumentBuilder();
            Document doc = builder.parse(new ByteArrayInputStream(xmlContent.getBytes(StandardCharsets.UTF_8)));

            String subject = doc.getElementsByTagName("subject").item(0).getTextContent();
            String body = doc.getElementsByTagName("body").item(0).getTextContent();

            return new EmailTemplate(subject, body);

        } catch (Exception e) {

            throw new IOException("Erro ao processar template XML", e);
        }
    }
}
