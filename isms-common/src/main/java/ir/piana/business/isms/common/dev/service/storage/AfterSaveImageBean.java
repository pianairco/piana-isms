package ir.piana.business.isms.common.dev.service.storage;


import ir.piana.business.isms.common.dev.uploadrest.AfterSaveImage;
import ir.piana.business.isms.common.dev.uploadrest.UploadController;
import ir.piana.business.isms.common.dev.service.sql.SqlService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import java.sql.SQLException;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.function.BiFunction;

@Component("afterSaveImage")
@Profile("production")
public class AfterSaveImageBean extends UploadController.AfterSaveImageAction {
    @Autowired
    private SqlService sqlService;

    BiFunction<HttpServletRequest, String, ResponseEntity> deleteSampleSessionImageBusiness = (request, path) -> {
        Object id = AfterSaveImage.getValueObject(request.getHeader("id"));

        try {
            sqlService.updateByQueryName("delete-session-image",
                    new Object[]{id});
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", id);
        return ResponseEntity.ok(map);
    };

    BiFunction<HttpServletRequest, String, ResponseEntity> replaceSampleSessionImageBusiness = (request, path) -> {
        Object id = AfterSaveImage.getValueObject(request.getHeader("id"));

        try {
            sqlService.updateByQueryName("replace-session-image",
                    new Object[]{path, id});
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", id);
        map.put("image_src", path);
        return ResponseEntity.ok(map);
    };

    BiFunction<HttpServletRequest, String, ResponseEntity> insertSampleSessionImageBusiness = (request, path) -> {
        Object sessionId = AfterSaveImage.getValueObject(request.getHeader("sessionId"));
//        Object orders = getValueObject(request.getHeader("orders"));

        Long orders = sqlService.selectLong("select max(orders) + 1 from samples_session_image where samples_session_id = ?", new Object[] {sessionId});

        long id = 0;
        try {
            id = sqlService.insertByQueryName("insert-session-image", "vavishka_seq",
                    new Object[]{path, sessionId, orders});
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", id);
        map.put("session_id", sessionId);
        map.put("orders", orders);
        map.put("image_src", path);
        return ResponseEntity.ok(map);
    };
}
