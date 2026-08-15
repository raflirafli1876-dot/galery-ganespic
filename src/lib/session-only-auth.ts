// Membuat sesi login bersifat "session storage": sesi berakhir saat tab/browser ditutup.
// Client Supabase (auto-generated) memakai localStorage, jadi kita bersihkan token
// tersebut setiap kali sesi browser (tab) baru dimulai.
const MARKER = "ganespic-browser-session";

if (typeof window !== "undefined") {
  try {
    if (!window.sessionStorage.getItem(MARKER)) {
      for (const key of Object.keys(window.localStorage)) {
        if (/^sb-.*-auth-token/.test(key)) window.localStorage.removeItem(key);
      }
      window.sessionStorage.setItem(MARKER, "1");
    }
  } catch {
    // storage tidak tersedia — abaikan
  }
}

export {};
