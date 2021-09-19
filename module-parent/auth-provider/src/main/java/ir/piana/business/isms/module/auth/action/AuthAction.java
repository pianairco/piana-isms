package ir.piana.business.isms.module.auth.action;

import ir.piana.business.isms.common.dev.sqlrest.AjaxController;
import ir.piana.business.isms.module.auth.data.entity.UserEntity;
import ir.piana.business.isms.module.auth.model.AppInfo;
import ir.piana.business.isms.module.auth.model.SiteInfo;
import ir.piana.business.isms.module.auth.model.UserModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;
import java.util.function.BiFunction;

@Service("auth")
public class AuthAction extends AjaxController.Action {

    public AppInfo createAppInfo(HttpServletRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // ToDo => appInfo setter
        String host = (String) request.getAttribute("host");
        String tenant = (String) request.getAttribute("tenant");

        AppInfo appInfo = null;
        String title = (String) request.getSession().getAttribute("fund-schema-title");
        if(title == null) {
            title = "سامانه مدیریت امنیت اطلاعات";
            request.getSession().setAttribute("fund-schema-title", title);
        }
        if(authentication.getPrincipal() instanceof UserModel) {
            UserEntity userEntity = ((UserModel) authentication.getPrincipal()).getUserEntity();
            appInfo = AppInfo.builder()
                    .isLoggedIn(true)
                    .isAdmin(authentication.getAuthorities().stream()
                            .filter(e -> e.getAuthority().equalsIgnoreCase("ROLE_ADMIN"))
                            .map(e -> true).findFirst().orElse(false))
                    .username(userEntity.getUsername())
                    .siteInfo(SiteInfo.builder().title(title).build())
                    .build();
        } else {
            appInfo = AppInfo.builder()
                    .isLoggedIn(false)
                    .isAdmin(false)
                    .username(authentication.getName())
                    .siteInfo(SiteInfo.builder().title(title).build())
                    .build();
        }
        return appInfo;
    }

    public BiFunction<HttpServletRequest, Map<String, Object>, ResponseEntity> appInfo = (request, body) -> {
        AppInfo appInfo1 = createAppInfo(request);
        return ResponseEntity.ok(appInfo1);
    };
}
