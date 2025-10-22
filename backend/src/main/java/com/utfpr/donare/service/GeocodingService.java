package com.utfpr.donare.service;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.utfpr.donare.dto.NominatimResponseDTO;
import org.springframework.stereotype.Service;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;

@Service
public class GeocodingService {

    private final HttpClient httpClient = HttpClient.newBuilder( )
            .version(HttpClient.Version.HTTP_2)
            .connectTimeout(Duration.ofSeconds(10))
            .build();
    private final ObjectMapper mapper = new ObjectMapper()
            .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

    public double[] obterCoordenadas(String logradouro, String cidade, String estado) {
        try {
            String enderecoCompleto = String.format("%s, %s, %s, Brazil", logradouro, cidade, estado);
            String encodedAddress = URLEncoder.encode(enderecoCompleto, StandardCharsets.UTF_8);

            String url = "https://nominatim.openstreetmap.org/search?q=" + encodedAddress + "&format=json";

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36")
                    .timeout(Duration.ofSeconds(10))
                    .GET()
                    .build();


            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString( ));

            if (response.statusCode() != 200 || response.body() == null || response.body().trim().isEmpty() || response.body().trim().equals("[]")) {
                return new double[]{0, 0};
            }

            String responseBody = response.body();
            NominatimResponseDTO[] results = mapper.readValue(responseBody, NominatimResponseDTO[].class);

            if (results.length > 0) {
                double lat = Double.parseDouble(results[0].getLat());
                double lon = Double.parseDouble(results[0].getLon());

                return new double[]{lat, lon};
            } else {
                throw new RuntimeException("Array de resultados vazio para: " + enderecoCompleto);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return new double[]{0, 0};
    }
}
