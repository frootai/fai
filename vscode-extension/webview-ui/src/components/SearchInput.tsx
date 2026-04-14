interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  resultCount?: number;
}

export default function SearchInput({ value, onChange, placeholder, resultCount }: SearchInputProps) {
  return (
    <div style={{ position: "relative", marginBottom: 16 }}>
      <input
        className="input"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "Search..."}
        style={{ paddingLeft: 32 }}
      />
      <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", opacity: 0.5 }}>🔍</span>
      {resultCount !== undefined && (
        <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", opacity: 0.5, fontSize: 11 }}>
          {resultCount} results
        </span>
      )}
    </div>
  );
}
