package ir.piana.business.isms.rest;

import ir.piana.business.isms.common.dev.uploadrest.AfterSaveImage;
import ir.piana.business.isms.common.dev.uploadrest.GroupProperties;
import ir.piana.business.isms.common.dev.uploadrest.StorageFileNotFoundException;
import ir.piana.business.isms.common.dev.uploadrest.StorageService;
import ir.piana.business.isms.common.model.ResponseModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.ApplicationContext;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

//@Controller
//@RequestMapping("api/images")
public class FileUploadController {
    @Autowired
    private ApplicationContext applicationContext;

    @Autowired
    @Qualifier("databaseStorageService")
    private StorageService storageService;

    @GetMapping("/")
    public String listUploadedFiles(Model model) throws IOException {

        model.addAttribute("files", storageService.loadAll().map(
                path -> MvcUriComponentsBuilder.fromMethodName(FileUploadController.class,
                        "serveFile", path.getFileName().toString()).build().toUri().toString())
                .collect(Collectors.toList()));

        return "uploadForm";
    }

    @GetMapping("/files/{filename:.+}")
    @ResponseBody
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {

        Resource file = storageService.loadAsResource(filename);
        return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=\"" + file.   getFilename() + "\"").body(file);
    }

    @PostMapping(value = "/image-upload", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ResponseModel> handleFileUpload(
            HttpServletRequest request,
            @RequestHeader("image_upload_group") String group,
            @RequestParam("file") MultipartFile file,
            RedirectAttributes redirectAttributes) {
        String rotation = request.getHeader("image-upload-rotation");
        String path = storageService.store(file, group, rotation);

        GroupProperties groupProperties = storageService.getGroupProperties(group);
        String afterSaveImageName = groupProperties.getAfterSaveImageActivity();

        if(afterSaveImageName != null && !afterSaveImageName.isEmpty()) {
            AfterSaveImage afterSaveImage = (AfterSaveImage) applicationContext.getBean(afterSaveImageName);
            return afterSaveImage.doWork(request, path);
        }

        Map map = new LinkedHashMap();
        map.put("path", path);

        redirectAttributes.addFlashAttribute("message",
                "You successfully uploaded " + file.getOriginalFilename() + "!");


        return ResponseEntity.ok(ResponseModel.builder().code(0).data(map).build());
    }

    @ExceptionHandler(StorageFileNotFoundException.class)
    public ResponseEntity<?> handleStorageFileNotFound(StorageFileNotFoundException exc) {
        return ResponseEntity.notFound().build();
    }
}
