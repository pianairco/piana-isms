package ir.piana.business.isms.rest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

@RestController
public class TestRest {
    @GetMapping(path = "error")
    public ResponseEntity error(HttpServletRequest request) {
        return ResponseEntity.ok("not fund");
    }

    @PostMapping(path = "login")
    public ResponseEntity login(HttpServletRequest request) {
        return ResponseEntity.ok("logged in");
    }

    @GetMapping(path = "test")
    public ResponseEntity testGet(HttpServletRequest request) {
        return ResponseEntity.ok("Hello World");
    }

    @GetMapping(path = "api/test")
    public ResponseEntity apiTestGet(HttpServletRequest request) {
        return ResponseEntity.ok("Hello World");
    }

    /*public static void main(String[] args) {
        System.out.println(mod3(27, 6));
    }

    static int mod3(int i, int j) {
        return (j + (i % j) - 1) / j;
    }*/
}
