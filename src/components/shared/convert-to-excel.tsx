import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';



interface columnDef{
    header:string;
    key:string;
    width:number;
}
export async function exportToExcel(
    columnDef:columnDef[],
    getData:()=>Promise<any[]>,
    nameSheet:string){

    const data = await getData()
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet(nameSheet)
    console.log(data)
    worksheet.columns =columnDef

    data?.data?.forEach(row=>worksheet.addRow(row))

    const headerRow = worksheet.getRow(1);
    headerRow.font = { name: 'Arial', size: 12, bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4F81BD' } // Professional blue fill
    };

    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer],{ type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    saveAs(blob,`${nameSheet}.xlsx`)
}