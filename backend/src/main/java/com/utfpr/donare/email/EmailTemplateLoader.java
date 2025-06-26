package com.utfpr.donare.email;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import java.io.IOException;
import java.io.StringReader;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class EmailTemplateLoader {

    public record EmailTemplate(String subject, String body) {}

    public EmailTemplate loadTemplate(String templateName, Map<String, String> variables) throws IOException {

        ClassPathResource resource = new ClassPathResource("mail-templates/" + templateName + ".xml");
        String xmlContent = new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);

        try {
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();

            Document doc = builder.parse(new InputSource(new StringReader(xmlContent)));

            String subjectTemplate = getElementValue(doc.getDocumentElement(), "subject");
            String bodyTemplate = getElementValue(doc.getDocumentElement(), "body");

            String finalSubject = replaceVariables(subjectTemplate, variables);
            String finalBody = replaceVariables(bodyTemplate, variables);

            return new EmailTemplate(finalSubject, finalBody);

        } catch (ParserConfigurationException | SAXException e) {
            throw new IOException("Erro de configuração do parser XML: " + e.getMessage(), e);
        }
    }

    private String getElementValue(Element parent, String tagName) {

        if (parent == null || !parent.getElementsByTagName(tagName).item(0).hasChildNodes()) {
            return "";
        }

        return parent.getElementsByTagName(tagName).item(0).getTextContent();
    }

    private String replaceVariables(String text, Map<String, String> variables) {

        if (text == null || variables == null || variables.isEmpty()) {
            return text;
        }

        Pattern pattern = Pattern.compile("\\{\\{(\\w+)\\}\\}");
        Matcher matcher = pattern.matcher(text);
        StringBuffer sb = new StringBuffer();

        while (matcher.find()) {
            String varName = matcher.group(1);
            String replacement = variables.getOrDefault(varName, matcher.group(0));
            matcher.appendReplacement(sb, Matcher.quoteReplacement(replacement));
        }

        matcher.appendTail(sb);

        return sb.toString();
    }
}