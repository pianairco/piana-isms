package ir.piana.business.isms.common.util;

import java.io.*;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

public class FileZipper {

    public void writeZipFilesToStream(Map<String, StringBuffer> files, OutputStream os) throws IOException {

//        ByteOutputStream fos = null;
        ZipOutputStream zipOut = null;
        ByteArrayInputStream fis = null;
        try {
            os = new ByteArrayOutputStream();
            zipOut = new ZipOutputStream(new BufferedOutputStream(os));
            for(String fileName : files.keySet()) {
                StringBuffer stringBuffer = files.get(fileName);
                ZipEntry ze = new ZipEntry(fileName);
                System.out.println("Zipping the file: " + fileName);
                zipOut.putNextEntry(ze);
                fis = new ByteArrayInputStream(stringBuffer.toString().getBytes());
                byte[] tmp = new byte[4*1024];
                int size = 0;
                while((size = fis.read(tmp)) != -1){
                    zipOut.write(tmp, 0, size);
                }
                zipOut.flush();
                fis.close();
            }
        } catch (FileNotFoundException e) {
            // TODO Auto-generated catch block
            throw e;
        } catch (IOException e) {
            // TODO Auto-generated catch block
            throw e;
        } finally{
//            try{
//                if(fos != null) fos.close();
//            } catch(Exception ex){
//
//            }
        }
    }

    public OutputStream zipFilesAsOutputStream(Map<String, StringBuffer> files) throws IOException {

        ByteArrayOutputStream fos = null;
        ZipOutputStream zipOut = null;
        ByteArrayInputStream fis = null;
        try {
            fos = new ByteArrayOutputStream();
            zipOut = new ZipOutputStream(new BufferedOutputStream(fos));
            for(String fileName : files.keySet()) {
                StringBuffer stringBuffer = files.get(fileName);
                ZipEntry ze = new ZipEntry(fileName);
                System.out.println("Zipping the file: " + fileName);
                zipOut.putNextEntry(ze);
                fis = new ByteArrayInputStream(stringBuffer.toString().getBytes());
                byte[] tmp = new byte[4*1024];
                int size = 0;
                while((size = fis.read(tmp)) != -1){
                    zipOut.write(tmp, 0, size);
                }
                zipOut.flush();
                fis.close();
            }
            return fos;
        } catch (FileNotFoundException e) {
            // TODO Auto-generated catch block
            throw e;
        } catch (IOException e) {
            // TODO Auto-generated catch block
            throw e;
        } finally{
//            try{
//                if(fos != null) fos.close();
//            } catch(Exception ex){
//
//            }
        }
    }

    public byte[] zipFilesAsByteArray(Map<String, StringBuffer> files) throws IOException {
        ByteArrayOutputStream fos = null;
        ZipOutputStream zipOut = null;
        ByteArrayInputStream fis = null;
        try {
            fos = new ByteArrayOutputStream();
            zipOut = new ZipOutputStream(new BufferedOutputStream(fos));
            for(String fileName : files.keySet()) {
                StringBuffer stringBuffer = files.get(fileName);
                ZipEntry ze = new ZipEntry(fileName);
                System.out.println("Zipping the file: " + fileName);
                zipOut.putNextEntry(ze);
                fis = new ByteArrayInputStream(stringBuffer.toString().getBytes());
                byte[] tmp = new byte[4*1024];
                int size = 0;
                while((size = fis.read(tmp)) != -1){
                    zipOut.write(tmp, 0, size);
                }
                zipOut.flush();
                fis.close();
            }
            return fos.toByteArray();
        } catch (FileNotFoundException e) {
            // TODO Auto-generated catch block
            throw e;
        } catch (IOException e) {
            // TODO Auto-generated catch block
            throw e;
        } finally{
            try{
                if(fos != null) fos.close();
            } catch(Exception ex){

            }
        }
    }

    public void zipFilesAndSave(Map<String, StringBuffer> files, String resultFilePath){

        FileOutputStream fos = null;
        ZipOutputStream zipOut = null;
        ByteArrayInputStream fis = null;
        try {
            fos = new FileOutputStream(resultFilePath);
            zipOut = new ZipOutputStream(new BufferedOutputStream(fos));
            for(String fileName : files.keySet()) {
                StringBuffer stringBuffer = files.get(fileName);
                ZipEntry ze = new ZipEntry(fileName);
                System.out.println("Zipping the file: " + fileName);
                zipOut.putNextEntry(ze);
                fis = new ByteArrayInputStream(stringBuffer.toString().getBytes());
                byte[] tmp = new byte[4*1024];
                int size = 0;
                while((size = fis.read(tmp)) != -1){
                    zipOut.write(tmp, 0, size);
                }
                zipOut.flush();
                fis.close();
            }
            zipOut.close();
            System.out.println("Done... Zipped the files...");
        } catch (FileNotFoundException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } finally{
            try{
                if(fos != null) fos.close();
            } catch(Exception ex){

            }
        }
    }

    public static void main(String a[]){

        FileZipper mfe = new FileZipper();
        Map<String, StringBuffer> files = new LinkedHashMap<>();
        files.put("test.component.css", new StringBuffer("p {color: 'red'}"));
        files.put("test.component.html", new StringBuffer("<p>color</p>"));
        files.put("test.component.ts", new StringBuffer("class PComponent {}"));
        mfe.zipFilesAndSave(files, "d:/testing.zip");
    }
}
