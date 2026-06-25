import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";

// Opsional: Register font custom jika ingin tampilan lebih modern (misal: Inter atau Roboto)
Font.register({
  family: "Helvetica-Bold",
  src: "https://fonts.gstatic.com/s/helveticaneue/v70/xxxx.ttf", // Menggunakan built-in Helvetica bawaan react-pdf juga aman
});

// Definisi Style mirip CSS / React Native
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: "Helvetica",
    color: "#333333",
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    marginBottom: 8,
    color: "#1a1a1a",
  },
  subtitle: {
    fontSize: 10,
    color: "#666666",
    marginBottom: 24,
  },
  // Container Utama Tabel
  table: {
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#e5e7eb", // border abu-abu tipis (seperti Tailwind border-gray-200)
    borderRadius: 4,
    overflow: "hidden",
  },
  // Header Tabel
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6", // latar abu-abu terang
    fontFamily: "Helvetica-Bold",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  // Baris Tabel (Row)
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  // Baris Selang-seling (Zebra striping untuk baris genap)
  tableRowEven: {
    flexDirection: "row",
    backgroundColor: "#f9fafb",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  // Kolom/Kapsul Cell
  tableColHeaderLabel: {
    width: "35%", // Lebar kolom label komponen (User, PT, Processor, dll)
    padding: 10,
    color: "#374151",
  },
  tableColHeaderValue: {
    width: "65%", // Lebar kolom nilai spesifikasinya
    padding: 10,
    color: "#374151",
  },
  tableColLabel: {
    width: "35%",
    padding: 10,
    fontFamily: "Helvetica-Bold", // Label dibuat tebal agar kontras
    color: "#4b5563",
    backgroundColor: "#f9fafb", // Sisi kiri diberi background tipis biar estetik
    borderRightWidth: 1,
    borderRightColor: "#e5e7eb",
  },
  tableColValue: {
    width: "65%",
    padding: 10,
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