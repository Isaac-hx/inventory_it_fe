

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