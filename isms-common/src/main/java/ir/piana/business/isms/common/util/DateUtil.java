package ir.piana.business.isms.common.util;

import java.sql.Date;
import java.text.SimpleDateFormat;
import java.util.Calendar;

public class DateUtil {
    private static int[] g_days_in_month = {31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};
    public static int[] j_days_in_month = {31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29};
    public static SimpleDateFormat timeFormat = new SimpleDateFormat("HH:mm");

    public static String getGregorianDate(String jalaiDate) {
        ///
        int j_y = Integer.parseInt(jalaiDate.substring(0, 4));
        int j_m = Integer.parseInt(jalaiDate.substring(5, 7));
        int j_d = Integer.parseInt(jalaiDate.substring(8));
        ///
        int gy, gm, gd;
        int jy, jm, jd;
        long g_day_no, j_day_no;
        int leap;

        int i;

        jy = j_y - 979;
        jm = j_m - 1;
        jd = j_d - 1;

        j_day_no = 365 * jy + (jy / 33) * 8 + (jy % 33 + 3) / 4;
        for (i = 0; i < jm; ++i)
            j_day_no += j_days_in_month[i];

        j_day_no += jd;

        g_day_no = j_day_no + 79;

        gy = (int) (1600 + 400 * (g_day_no / 146097)); /* 146097 = 365*400 + 400/4 - 400/100 + 400/400 */
        g_day_no = g_day_no % 146097;

        leap = 1;
        if (g_day_no >= 36525) /* 36525 = 365*100 + 100/4 */ {
            g_day_no--;
            gy += 100 * (g_day_no / 36524); /* 36524 = 365*100 + 100/4 - 100/100 */
            g_day_no = g_day_no % 36524;

            if (g_day_no >= 365)
                g_day_no++;
            else
                leap = 0;
        }

        gy += 4 * (g_day_no / 1461); /* 1461 = 365*4 + 4/4 */
        g_day_no %= 1461;

        if (g_day_no >= 366) {
            leap = 0;

            g_day_no--;
            gy += g_day_no / 365;
            g_day_no = g_day_no % 365;
        }

        for (i = 0; g_day_no >= g_days_in_month[i] + ((i == 1 && leap == 1) ? 1 : 0); i++)
            g_day_no -= g_days_in_month[i] + ((i == 1 && leap == 1) ? 1 : 0);
        gm = i + 1;
        gd = (int) g_day_no + 1;

//        return gy + "-" + gm + "-" + gd;
        return gy + "-" + (gm < 10 ? "0" + gm : "" + gm) + "-" + (gd < 10 ? "0" + gd : "" + gd);
    }

    public static Date getGregorianDateAsDate(String jalaiDate) {
        return Date.valueOf(getGregorianDate(jalaiDate));
    }

    public static int getDayOfWeekIndexJalali(String jDate) {
        String gDate = getGregorianDate(jDate);
        Date d = Date.valueOf(gDate);
        Calendar c = Calendar.getInstance();
        c.setTime(d);
        int i = c.get(Calendar.DAY_OF_WEEK);
        return i - 1;
    }

    public static String getJalaliDate(String gregorianDate) {
        ///
        int g_y = Integer.parseInt(gregorianDate.substring(0, 4));
        int g_m = Integer.parseInt(gregorianDate.substring(5, 7));
        int g_d = Integer.parseInt(gregorianDate.substring(8));
        ///
        int gy, gm, gd;
        int jy, jm, jd;
        long g_day_no, j_day_no;
        int j_np;

        int i;
        gy = g_y - 1600;
        gm = g_m - 1;
        gd = g_d - 1;

        g_day_no = 365 * gy + (gy + 3) / 4 - (gy + 99) / 100 + (gy + 399) / 400;
        for (i = 0; i < gm; ++i)
            g_day_no += g_days_in_month[i];
        if (gm > 1 && ((gy % 4 == 0 && gy % 100 != 0) || (gy % 400 == 0)))
            /* leap and after Feb */
            ++g_day_no;
        g_day_no += gd;

        j_day_no = g_day_no - 79;

        j_np = (int) j_day_no / 12053;

        j_day_no %= 12053;

        jy = (int) (979 + 33 * j_np + 4 * (j_day_no / 1461));
        j_day_no %= 1461;

        if (j_day_no >= 366) {
            jy += (j_day_no - 1) / 365;
            j_day_no = (j_day_no - 1) % 365;
        }

        for (i = 0; i < 11 && j_day_no >= j_days_in_month[i]; ++i) {
            j_day_no -= j_days_in_month[i];
        }
        jm = i + 1;
        jd = (int) j_day_no + 1;

        return jy + "/" + (jm < 10 ? "0" + jm : "" + jm) + "/" + (jd < 10 ? "0" + jd : "" + jd);
    }

    public static String getTodayJalali() {
        Date date = new Date(System.currentTimeMillis());
        String gregorianDate = date.toString();
        return getJalaliDate(gregorianDate);
    }

    public static String getTime() {
        return timeFormat.format(new java.util.Date());
    }

    public static String addDaysToJalaliDate(String jalaliDate, int days) {
        String gDate = getGregorianDate(jalaliDate);
        Date d = Date.valueOf(gDate);
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(d);
        calendar.add(Calendar.DAY_OF_YEAR,days);
        gDate = new Date(calendar.getTimeInMillis()).toString();
        String jDate = getJalaliDate(gDate);
        return jDate;
    }

    public static long getDateDiff(String firstDate, String secondDate) {
        String fDate = getGregorianDate(firstDate);
        Date fGregorianDate = Date.valueOf(fDate);
        long fTime = fGregorianDate.getTime();

        String sDate = getGregorianDate(secondDate);
        Date sGregorianDate = Date.valueOf(sDate);
        long sTime = sGregorianDate.getTime();

        return (Math.abs(fTime - sTime) + 2 * 60 * 60 * 1000) / (24 * 60 * 60 * 1000);

    }

    public static long getRealDateDiff(String firstDate, String secondDate) {
        String fDate = getGregorianDate(firstDate);
        Date fGregorianDate = Date.valueOf(fDate);
        long fTime = fGregorianDate.getTime();

        String sDate = getGregorianDate(secondDate);
        Date sGregorianDate = Date.valueOf(sDate);
        long sTime = sGregorianDate.getTime();

        if (fTime < sTime) {
            fTime -= 2 * 60 * 60 * 1000;
            sTime += 2 * 60 * 60 * 1000;
        } else {
            fTime += 2 * 60 * 60 * 1000;
            sTime -= 2 * 60 * 60 * 1000;
        }

        return (fTime - sTime) / (24 * 60 * 60 * 1000);

    }

    public static long getDateDiff2(String firstDate, String secondDate) {

        long fYear = Long.valueOf(firstDate.substring(0, 4));
        long sYear = Long.valueOf(secondDate.substring(0, 4));
        long fMonth = Long.valueOf(firstDate.substring(5, 7));
        long sMonth = Long.valueOf(secondDate.substring(5, 7));
        long fday = Long.valueOf(firstDate.substring(8, 10));
        long sday = Long.valueOf(secondDate.substring(8, 10));

//    if (fday > 30 || (fday == 29 && fMonth == 12))
//        fday = 30;
//    if (sday > 30 || (sday == 29 && sMonth == 12))
//        sday = 30;

        if (fday > 30)
            fday = 30;
        if (sday > 30)
            sday = 30;

        long yearDiff = sYear - fYear;
        long monthDiff = sMonth - fMonth;
        long dayDiff = sday - fday;
        long diff = yearDiff * 360 + monthDiff * 30 + dayDiff;

        return Math.abs(diff);
    }
}
