package ir.piana.business.isms.module.auth.service;

import ir.piana.business.isms.module.auth.data.entity.UserEntity;
import ir.piana.business.isms.module.auth.data.repository.UserRepository;
import ir.piana.business.isms.module.auth.model.UserModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@Component("userDetailsService")
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String encodedUsername) throws UsernameNotFoundException {
        String username = null;
        boolean isForm = false;
        String[] split = null;
        if(encodedUsername.contains(":")) {
            split = encodedUsername.split(":");
            username = new String(Base64.getDecoder().decode(username = split[split.length - 1]));
            if(split[0].equalsIgnoreCase("form")) {
                isForm = true;
            } else {
//                ToDo
            }
        }

        UserEntity appUserEntity = userRepository.findByUsername(username);
        if (appUserEntity == null) {
            throw new UsernameNotFoundException(encodedUsername);
        }
        List<GrantedAuthority> authorities = new ArrayList<>();
//        List<GrantedAuthority> authorities = appUserEntity.getUserRolesEntities().stream()
//                .map(e -> new SimpleGrantedAuthority(e.getRoleName())).collect(Collectors.toList());

        authorities.add(new SimpleGrantedAuthority("ROLE_AUTHENTICATED"));
        return new UserModel(appUserEntity.getUsername(),
                appUserEntity.getPassword(),
                authorities, appUserEntity);
    }
}
