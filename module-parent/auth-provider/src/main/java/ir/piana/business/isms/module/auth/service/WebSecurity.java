package ir.piana.business.isms.module.auth.service;

import ir.piana.business.isms.module.auth.action.AuthAction;
import ir.piana.business.isms.module.auth.data.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@Profile("production")
public class WebSecurity extends WebSecurityConfigurerAdapter {
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    @Qualifier("userDetailsService")
    UserDetailsServiceImpl userDetailsService;

    @Autowired
    private UserRepository appUserRepository;

    @Autowired
    private AuthAction authAction;

    @Autowired
    private Environment env;

    //https://www.logicbig.com/tutorials/spring-framework/spring-boot/jdbc-security-with-h2-console.html
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable()
//        http.cors().and().csrf().disable()
                .authorizeRequests()
                .antMatchers(HttpMethod.POST,
                        "/api/sign-in",
                        "/api/sign-in/sub-domain",
                        "/api/sign-in/sub-domain/set-token",
                        "/api/sign-in/sub-domain/set-login-info",
                        "/api/sign-in/sub-domain/set-principal",
                        "/api/sign-up",
                        "/api/app-info"/*,
                        "/h2/console/**"*/)
                .permitAll()
                .antMatchers(HttpMethod.GET, "/api/**").permitAll()
                .antMatchers(HttpMethod.POST, "/api/ajax/serve").permitAll()
//                .antMatchers(HttpMethod.POST, "/api/modules/**").authenticated()
                .antMatchers(HttpMethod.POST, "/api/sign-out").hasRole("AUTHENTICATED")
                .antMatchers(HttpMethod.POST, "/api/site/**").hasRole("AUTHENTICATED")
                .antMatchers(HttpMethod.PUT, "/api/site/**").hasRole("AUTHENTICATED")
                .antMatchers(HttpMethod.DELETE, "/api/site/**").hasRole("AUTHENTICATED")
                .antMatchers(HttpMethod.POST, "/api/shop/**").hasRole("SITE_OWNER")
                .antMatchers(HttpMethod.PUT, "/api/shop/**").hasRole("SITE_OWNER")
                .antMatchers(HttpMethod.DELETE, "/api/shop/**").hasRole("SITE_OWNER")
//                .antMatchers(HttpMethod.POST, "/api/ajax/serve").hasRole("user")
//                .antMatchers(HttpMethod.POST, "/vavishka-shop/login").permitAll()
//                .antMatchers(HttpMethod.POST, "/action").permitAll()//.authenticated()
//                .antMatchers(HttpMethod.POST, "/logout").authenticated()
//                .antMatchers(HttpMethod.GET, "/hello").authenticated()
//                .antMatchers(HttpMethod.GET, "/home.do").authenticated()
//                .antMatchers(HttpMethod.GET, "/**").permitAll()
//                .anyRequest().authenticated()
//                .antMatchers("/images/**").permitAll()
//                .antMatchers("/login").permitAll()
                .anyRequest().permitAll()
                .and()
//                .formLogin()
//                .loginPage("/login")
//                .loginProcessingUrl("/login")
//                .successForwardUrl("/hello")
//                .defaultSuccessUrl("/home")
//                .successHandler(getSuccessHandler())
//                .failureUrl("/error")
//                .permitAll()
//                .and()
                .headers().frameOptions().disable()
                .and()
//                .addFilterBefore(new CustomFilterExceptionHandlerFilter(
//                        multiShopDataSources, failedDataSources, dataSourceMap),
//                        MultiTenantFilter.class)
//                .addFilterBefore(new MultiTenantFilter(
//                        multiShopDataSources, failedDataSources, dataSourceService),
//                        CustomAuthenticationFilter.class)
//                .addFilter(new CustomAuthenticationFilter(authenticationManager()))
                .addFilterBefore(new JWTAuthenticationFilter("/api/sign-in",
                                authenticationManager(), passwordEncoder, authAction, env),
                        UsernamePasswordAuthenticationFilter.class)
//                .addFilterBefore(new JWTAuthorizationFilter(authenticationManager(), authTokenModelRepository),
//                        UsernamePasswordAuthenticationFilter.class);
//                .addFilter(new JWTAuthorizationFilter(authenticationManager()))
//                 this disables session creation on Spring Security
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.ALWAYS);
    }


    @Bean
    public AuthenticationSuccessHandler getSuccessHandler() {
        SimpleUrlAuthenticationSuccessHandler handler = new SimpleUrlAuthenticationSuccessHandler();
        handler.setUseReferer(true);
        return handler;
    }

//    @Bean
//    @Order(1)
//    public CustomAuthenticationFilter customAuthenticationFilter() throws Exception {
//        CustomAuthenticationFilter customAuthenticationFilter = new CustomAuthenticationFilter();
//        return customAuthenticationFilter;
//    }

    @Override
    public void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder);
    }

//    @Autowired
//    public void initialize(AuthenticationManagerBuilder builder) throws Exception {
//        builder.userDetailsService(userDetailsService).passwordEncoder(bCryptPasswordEncoder)
//                .and().authenticationProvider(authenticationProvider);
//    }

//    @Override
//    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
//        auth.userDetailsService(userDetailsService).passwordEncoder(bCryptPasswordEncoder)
//                .and().authenticationProvider(authenticationProvider);
//    }

//    @Override
//    public void configure(AuthenticationManagerBuilder auth) throws Exception {
//        auth.userDetailsService(userDetailsService).passwordEncoder(bCryptPasswordEncoder);
//    }

//    @Bean
//    CorsConfigurationSource corsConfigurationSource() {
//        final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        source.registerCorsConfiguration("/**", new CorsConfiguration()
////                .applyPermitDefaultValues()
//                .setAllowedOriginPatterns(Arrays.asList("*", "https://piana.ir")));
//        return source;
//    }
}
