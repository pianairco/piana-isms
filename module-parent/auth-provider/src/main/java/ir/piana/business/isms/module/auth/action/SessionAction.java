package ir.piana.business.isms.module.auth.action;

import ir.piana.business.isms.common.dev.service.sql.SqlService;
import ir.piana.business.isms.common.dev.uploadrest.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.sql.SQLException;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.function.BiFunction;

@Service("sample-session")
public class SessionAction {
    @Autowired
    @Qualifier("fileSystemStorageService")
    private StorageService storageService;

    @Autowired
    private SqlService sqlService;

    public BiFunction<HttpServletRequest, Map<String, Object>, ResponseEntity> addSession = (request, sampleItem) -> {
        String group = request.getHeader("file-group");
        String iconSrc = storageService.store((String) sampleItem.get("icon"), group, 0);
//        sqlService.update(group,
//                new Object[]{sampleItem.get("title"), sampleItem.get("description"), imageSrc});
        long id = 0;
        try {
            id = sqlService.insert(group, "vavishka_seq",
                    new Object[]{sampleItem.get("samples_id"),
                            sampleItem.get("title"),
                            sampleItem.get("description"),
                            iconSrc,
                            sampleItem.get("orders")});
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        Map map = new LinkedHashMap();
        map.put("id", id);
        map.put("samples_id", sampleItem.get("samples_id"));
        map.put("title", (String)sampleItem.get("title"));
        map.put("description", (String)sampleItem.get("description"));
        map.put("orders", sampleItem.get("orders"));
        map.put("icon_src", iconSrc);

        try {
            long id2 = sqlService.insertByQueryName("insert-session-image", "vavishka_seq",
                    new Object[]{iconSrc, id, 1});
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

        return ResponseEntity.ok(map);
    };
}
