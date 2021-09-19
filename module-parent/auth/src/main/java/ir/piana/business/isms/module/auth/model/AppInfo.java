package ir.piana.business.isms.module.auth.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppInfo {
    private String username;
    private String email;
    private String pictureUrl;
    @JsonProperty("isLoggedIn")
    private boolean isLoggedIn;
    @JsonProperty("isFormPassword")
    private boolean isFormPassword;
    @JsonProperty("isAdmin")
    private boolean isAdmin;
    private SiteInfo siteInfo;
}
