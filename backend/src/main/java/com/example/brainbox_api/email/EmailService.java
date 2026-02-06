package com.example.brainbox_api.email;

import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

@Service
public class EmailService {

    private Resend resend;

    @Value("${resend.api.key}")
    private String apiKey;

    @Value("${resend.from.email}")
    private String fromEmail;

    @PostConstruct
    public void init() {
        if (apiKey == null || apiKey.isEmpty() || apiKey.equals("${RESEND_API_KEY}")) {
            System.err.println("WARNING: Resend API Key is not configured correctly.");
            return;
        }
        this.resend = new Resend(apiKey);
    }

    public void sendEmail(String to, String subject, String htmlContent) {
        if (resend == null) {
            System.err.println("Cannot send email: Resend client is not initialized. Check your API key.");
            throw new IllegalStateException("Email service is not configured. Please contact support.");
        }

        if (fromEmail == null || fromEmail.isEmpty() || fromEmail.equals("${RESEND_FROM_EMAIL}")) {
            System.err.println("Cannot send email: From email is not configured.");
            throw new IllegalStateException("Email sender is not configured. Please contact support.");
        }

        CreateEmailOptions sendEmailRequest = CreateEmailOptions.builder()
                .from(fromEmail)
                .to(to)
                .subject(subject)
                .html(htmlContent)
                .build();

        try {
            CreateEmailResponse data = resend.emails().send(sendEmailRequest);
            System.out.println("Email sent successfully with ID: " + data.getId());
        } catch (ResendException e) {
            System.err.println("Failed to send email via Resend: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to send email. Please try again later.", e);
        } catch (Exception e) {
            System.err.println("An unexpected error occurred while sending email: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("An unexpected error occurred during email delivery.", e);
        }
    }
}
