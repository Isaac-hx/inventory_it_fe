import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";

// Opsional: Register font custom jika ingin tampilan lebih modern (misal: Inter atau Roboto)
Font.register({
  family: "Helvetica-Bold",
  src: "https://fonts.gstatic.com/s/helveticaneue/v70/xxxx.ttf", // Menggunakan built-in Helvetica bawaan react-pdf juga aman
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10, // Sedikit diperkecil agar lebih rapi
    fontFamily: "Helvetica",
    color: "#333333",
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 16, // Diperkecil sedikit dari 18
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
    color: "#1a1a1a",
  },
  subtitle: {
    fontSize: 9,
    color: "#666666",
    marginBottom: 16, // Jarak ke tabel dikurangi
  },
  
  // Container Utama Tabel
  table: {
    width: "100%", // Ubah ke 100% agar memenuhi halaman secara proporsional
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#e5e7eb", 
    borderRadius: 4,
    overflow: "hidden",
  },
  
  // Header Tabel
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6", 
    fontFamily: "Helvetica-Bold",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  
  // Baris Tabel (Row)
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb", // Disamakan agar konsisten
  },

  // Pengaturan Lebar Kolom (Total Harus 100%)
  // Mengurangi padding dari 10 ke 6 atau 8 membuat row otomatis lebih ramping
  tableColHeaderLabel: {
    width: "30%", // Disesuaikan porsinya
    paddingVertical: 6,
    paddingHorizontal: 8,
    color: "#374151",
  },
  tableColHeaderValue: {
    width: "70%", // Sisa dari 100%
    paddingVertical: 6,
    paddingHorizontal: 8,
    color: "#374151",
  },
  tableColLabel: {
    width: "30%", // Harus sama dengan header-nya
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontFamily: "Helvetica-Bold", 
    color: "#4b5563",
    backgroundColor: "#f9fafb", 
    borderRightWidth: 1,
    borderRightColor: "#e5e7eb",
  },
  tableColValue: {
    width: "70%", // Harus sama dengan header-nya
    paddingVertical: 6,
    paddingHorizontal: 8,
    color: "#1f2937",
  },
});
// Tipe Data Props (Sesuaikan dengan data kamu dari backend)
interface AssetData {
  user: string;
  pt: string;
  processor: string;
  ram: string;
  storage: string;
}

export default function AssetReport({ data }: { data: AssetData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Dokumen */}
        <Text style={styles.title}>Spesifikasi Aset Karyawan</Text>
        <Text style={styles.subtitle}>
          Dicetak pada: {new Date().toLocaleDateString("id-ID")}
        </Text>

        {/* Struktur Tabel */}
        <View style={styles.table}>
          {/* Header Baris */}
          <View style={styles.tableHeader}>
            <Text style={styles.tableColHeaderLabel}>Komponen</Text>
            <Text style={styles.tableColHeaderValue}>Spesifikasi / Keterangan</Text>
          </View>

          {/* Baris User */}
          <View style={styles.tableRow}>
            <Text style={styles.tableColLabel}>User</Text>
            <Text style={styles.tableColValue}>{data.user || "-"}</Text>
          </View>

          {/* Baris PT */}
          <View style={styles.tableRow}>
            <Text style={styles.tableColLabel}>PT</Text>
            <Text style={styles.tableColValue}>{data.pt || "-"}</Text>
          </View>

          {/* Baris Processor */}
          <View style={styles.tableRow}>
            <Text style={styles.tableColLabel}>Processor</Text>
            <Text style={styles.tableColValue}>{data.processor || "-"}</Text>
          </View>

          {/* Baris RAM */}
          <View style={styles.tableRow}>
            <Text style={styles.tableColLabel}>RAM</Text>
            <Text style={styles.tableColValue}>{data.ram || "-"}</Text>
          </View>

          {/* Baris Storage */}
          <View style={styles.tableRow}>
            <Text style={styles.tableColLabel}>Storage</Text>
            <Text style={styles.tableColValue}>{data.storage || "-"}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}