package com.eresolve.complaintmanagement.util;


import com.eresolve.complaintmanagement.entity.Report;
import com.lowagie.text.*;
import com.lowagie.text.pdf.*;

import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.stream.Stream;

public class PdfGenerator {

    public static byte[] generateReportPdf(List<Report> reports) throws DocumentException {
        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        PdfWriter.getInstance(document, out);
        document.open();

        Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16);
        @SuppressWarnings("unused")
		Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 12);

        Paragraph title = new Paragraph("Complaint Report Summary", headerFont);
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);
        document.add(Chunk.NEWLINE);

        PdfPTable table = new PdfPTable(6);
        table.setWidthPercentage(100);
        table.setWidths(new int[]{1, 2, 2, 2, 2, 2});

        addTableHeader(table);
        for (Report report : reports) {
            table.addCell(String.valueOf(report.getReportId()));
            table.addCell(String.valueOf(report.getComplaintId()));
            table.addCell(String.valueOf(report.getUserId()));
            table.addCell(report.getComplaintTitle() != null ? report.getComplaintTitle() : "N/A");
            table.addCell(report.getStatus() != null ? report.getStatus().toString() : "N/A");
            table.addCell(report.getGeneratedDate().toString());
        }

        document.add(table);
        document.close();

        return out.toByteArray();
    }

    private static void addTableHeader(PdfPTable table) {
        Stream.of("Report ID", "Complaint ID", "User ID", "Title", "Status", "Generated At")
                .forEach(columnTitle -> {
                    PdfPCell header = new PdfPCell();
                    header.setPhrase(new Phrase(columnTitle));
                    table.addCell(header);
                });
       }


}
