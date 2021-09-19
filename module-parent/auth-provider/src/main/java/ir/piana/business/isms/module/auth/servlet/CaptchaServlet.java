package ir.piana.business.isms.module.auth.servlet;

import nl.captcha.Captcha;
import nl.captcha.servlet.CaptchaServletUtil;
import nl.captcha.text.producer.NumbersAnswerProducer;
import nl.captcha.text.producer.TextProducer;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.awt.*;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class CaptchaServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private int numbersAnswerProducer = 5;
    private int width = 200;
    private int height = 50;
    private static final List<Color> COLORS = new ArrayList(2);
    private static final List<Font> FONTS = new ArrayList(3);

    static {
        COLORS.add(Color.BLACK);
        COLORS.add(Color.BLUE);
        FONTS.add(new Font("Geneva", 2, 48));
        FONTS.add(new Font("Courier", 1, 48));
        FONTS.add(new Font("Arial", 1, 48));
    }

    public CaptchaServlet() {
    }

    public CaptchaServlet(int width, int height, int numbersAnswerProducer) {
        this.width = width;
        this.height = height;
        this.numbersAnswerProducer = numbersAnswerProducer;
    }

    public void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        TextProducer renderer = new NumbersAnswerProducer(numbersAnswerProducer);
        Captcha captcha = (new Captcha.Builder(width, height))
                .addText(renderer).addNoise().build();
        CaptchaServletUtil.writeImage(resp, captcha.getImage());
        req.getSession().setAttribute("simpleCaptcha", captcha);
    }
}
