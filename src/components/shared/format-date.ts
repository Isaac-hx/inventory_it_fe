

export function FormatDate(inputDateStr:string){
  const dateObj = new Date(inputDateStr);

  // 2. Format menggunakan Intl.DateTimeFormat (pastikan locale 'en-US' atau 'en-GB' agar bulan berbahasa Inggris)
  const formatter = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  // Hasilnya akan berupa "20 June 2026"
  const formattedDate = formatter.format(dateObj);
  return formattedDate
}
export function formatToInputDate(inputDateStr: string) {
  if (!inputDateStr) return "";
  
  const dateObj = new Date(inputDateStr);
  
  // Validasi jika string tanggal rusak/tidak valid
  if (isNaN(dateObj.getTime())) return "";

  const year = dateObj.getFullYear();
  // month dimulai dari 0, jadi harus ditambah 1. padStart memastikan selalu 2 digit (misal: "06")
  const month = String(dateObj.getMonth() + 1).padStart(2, '0'); 
  const day = String(dateObj.getDate()).padStart(2, '0');

  // Menghasilkan format "YYYY-MM-DD"
  return `${year}-${month}-${day}`;
}