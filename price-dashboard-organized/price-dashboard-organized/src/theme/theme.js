export const PALETTE = {
  light: {
    bg: "#EEF3F8", surface: "#FFFFFF", surfaceAlt: "#F5F9FC",
    ink: "#0F1E33", inkSoft: "#5B6E85", inkFaint: "#8DA0B5",
    border: "#DCE6EF", borderSoft: "#E9F0F6",
    primary: "#0B5FA5", primaryDeep: "#08477E", primarySoft: "#E5EFF9",
    green: "#0E9D6E", greenSoft: "#E1F6EE", greenDeep: "#087551",
    shadow: "0 1px 2px rgba(15,30,51,0.04), 0 10px 30px rgba(15,30,51,0.07)"
  },
  dark: {
    bg: "#08111F", surface: "#0F1C2E", surfaceAlt: "#0B1626",
    ink: "#E8F1FA", inkSoft: "#93A8C0", inkFaint: "#5D7089",
    border: "#1D2C42", borderSoft: "#162335",
    primary: "#5AA9E6", primaryDeep: "#8CC5F0", primarySoft: "#122844",
    green: "#3FD6A3", greenSoft: "#0E2A22", greenDeep: "#6EE7BE",
    shadow: "0 1px 2px rgba(0,0,0,0.4), 0 10px 30px rgba(0,0,0,0.45)"
  }
};

export const RISK = {
  safe: { key: "safe", label: "Normal", c: "#16A34A", bgL: "#E7F7ED", bgD: "#0E2A1C" },
  watch: { key: "watch", label: "Watch", c: "#D97706", bgL: "#FDF1DE", bgD: "#2E2109" },
  spike: { key: "spike", label: "Price Spike Expected", c: "#EA580C", bgL: "#FDE9DD", bgD: "#331C0C" },
  critical: { key: "critical", label: "Immediate Intervention Required", c: "#DC2626", bgL: "#FCE4E4", bgD: "#330F0F" }
};

export const FONT_LINK = "https://fonts.googleapis.com/css2?family=Manrope:wght@500;700;800&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap";
