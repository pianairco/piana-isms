package ir.piana.business.isms.module.auth.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.fasterxml.jackson.databind.ObjectMapper;
import ir.piana.business.isms.common.exceptions.HttpCommonRuntimeException;
import ir.piana.business.isms.common.util.CommonUtils;
import ir.piana.business.isms.module.auth.action.AuthAction;
import ir.piana.business.isms.module.auth.data.entity.UserEntity;
import ir.piana.business.isms.module.auth.model.AppInfo;
import ir.piana.business.isms.module.auth.model.LoginInfo;
import ir.piana.business.isms.module.auth.model.UserModel;
import nl.captcha.Captcha;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.*;

public class JWTAuthenticationFilter extends AbstractAuthenticationProcessingFilter {

    private Environment env;
    private PasswordEncoder passwordEncoder;
    private AuthenticationManager authenticationManager;
    private AuthAction authAction;

    public JWTAuthenticationFilter(
            String loginUrl,
            AuthenticationManager authenticationManager,
            PasswordEncoder passwordEncoder,
            AuthAction authAction,
            Environment env) {
        super(new AntPathRequestMatcher(loginUrl));
        this.authAction = authAction;
        this.authenticationManager = authenticationManager;
        this.passwordEncoder = passwordEncoder;
        this.env = env;
    }

    Authentication byForm(String username, String password, String captcha, Captcha sessionCaptcha, String host)
            throws IOException {
        if(captcha != null && sessionCaptcha != null) {
            if (!sessionCaptcha.isCorrect(captcha)) {
                throw new HttpCommonRuntimeException(HttpStatus.UNAUTHORIZED, 1, "captcha failed");
            } else if (CommonUtils.isNull(username) || CommonUtils.isNull(password)) {
                throw new HttpCommonRuntimeException(HttpStatus.valueOf(404), 1, "access token not provided");
            }
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        "form:" + host + ":" + new String(Base64.getEncoder().encode(username.getBytes(StandardCharsets.UTF_8))),
                        password,
//                        "form:" + new String(Base64.getEncoder().encode(loginInfo.getPassword().getBytes(StandardCharsets.UTF_8))),
                        new ArrayList<>())
        );

        return authentication;
    }

    @Override
    public Authentication attemptAuthentication(
            HttpServletRequest request, HttpServletResponse res) throws AuthenticationException {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if(authentication != null && authentication.isAuthenticated())
                return authentication;

            String host = (String) request.getAttribute("host");
            if(request.getContentType() != null &&
                    (request.getContentType().startsWith("APPLICATION/JSON") ||
                            request.getContentType().startsWith("application/json"))) {
                LoginInfo loginInfo = new ObjectMapper().readValue(request.getInputStream(), LoginInfo.class);
                /*if(Arrays.stream(env.getActiveProfiles()).anyMatch(p -> "develop".matches(p))) {
                    return byForm(
                            "rahmatii1366@gmail.com",
                            "0000",
                            null,
                            null, host);
                }*/

                if(loginInfo != null && !CommonUtils.isNull(loginInfo.getUsername())) {
                    Captcha sessionCaptcha = (Captcha)request.getSession().getAttribute("simpleCaptcha");
                    if(Arrays.stream(env.getActiveProfiles()).anyMatch(p -> "develop".matches(p))) {
                        loginInfo.setCaptcha(sessionCaptcha.getAnswer());
                        loginInfo.setPassword("0000");
                    }
                    return byForm(
                            loginInfo.getUsername(), loginInfo.getPassword(), loginInfo.getCaptcha(), sessionCaptcha, host);
                } else {
                    throw new RuntimeException();
                }
            }
            throw new RuntimeException();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request,
                                            HttpServletResponse res,
                                            FilterChain chain,
                                            Authentication auth) throws IOException, ServletException {
        SecurityContextHolder.getContext().setAuthentication(auth);
        UserEntity userEntity = ((UserModel)auth.getPrincipal()).getUserEntity();
        String token = JWT.create()
                .withSubject(((User) auth.getPrincipal()).getUsername())
                .withExpiresAt(new Date(System.currentTimeMillis() + 864_000_000))
                .sign(Algorithm.HMAC512("SecretKeyToGenJWTs".getBytes()));
        request.getSession().setAttribute("jwt-token", token);
        request.getSession().setAttribute("authentication", auth.getPrincipal());
        request.getSession().setAttribute("authorization", ((User) auth.getPrincipal()).getUsername());
        request.getSession().setAttribute("user", userEntity);

        String host = (String) request.getAttribute("host");
        String tenant = (String) request.getAttribute("tenant");
        Optional<? extends GrantedAuthority> role_owner = null;
        String title = "سامانه ISMS";

        request.getSession().setAttribute("fund-schema-title", title);
        AppInfo appInfo = authAction.createAppInfo(request);
        res.setStatus(HttpStatus.OK.value());
        res.setContentType("application/json;charset=UTF-8");
        res.getWriter().print(new ObjectMapper().writeValueAsString(appInfo));
        res.getWriter().flush();
    }
}
