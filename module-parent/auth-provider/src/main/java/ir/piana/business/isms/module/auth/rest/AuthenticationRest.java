package ir.piana.business.isms.module.auth.rest;

import ir.piana.business.isms.module.auth.action.AuthAction;
import ir.piana.business.isms.module.auth.data.repository.UserRepository;
import ir.piana.business.isms.module.auth.model.AppInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.Map;

@RestController
@RequestMapping("/api/modules/auth")
public class AuthenticationRest {
    @Autowired
    private AuthAction authAction;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${login.redirect.url}")
    private String loginRedirect;

    @PostConstruct
    public void init() {
        System.out.println(loginRedirect);
    }

    @CrossOrigin
    @PostMapping(path = "app-info",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<AppInfo> getAppInfo(HttpServletRequest request,
                                              @RequestBody Map<String, Object> body,
                                              HttpSession session) {
        return authAction.appInfo.apply(request, body);
    }
}
