import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Search } from "lucide-react";
import { APP_LOGO, APP_TITLE } from "@/const";

interface Equipment {
  ItemMarca: string;
  ItemModelo: string;
  NumeroRegistro: string;
  LINK: string;
}

export default function Home() {
  const [data, setData] = useState<Equipment[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [selectedTab, setSelectedTab] = useState<"marca" | "modelo">("marca");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [results, setResults] = useState<Equipment[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Carregar dados JSON
  useEffect(() => {
    fetch("/dados.json")
      .then((res) => res.json())
      .then((jsonData) => setData(jsonData))
      .catch((err) => console.error("Erro ao carregar dados:", err));
  }, []);

  // Gerar sugestões baseadas na entrada
  const handleInputChange = (value: string) => {
    setSearchInput(value);

    if (value.trim().length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      setResults([]);
      return;
    }

    const field = selectedTab === "marca" ? "ItemMarca" : "ItemModelo";
    const filtered = data
      .filter((item) =>
        item[field].toLowerCase().includes(value.toLowerCase())
      )
      .map((item) => item[field]);

    const uniqueSuggestions = Array.from(new Set(filtered)).slice(0, 10);
    setSuggestions(uniqueSuggestions);
    setShowSuggestions(true);
  };

  // Selecionar uma sugestão
  const handleSelectSuggestion = (suggestion: string) => {
    setSearchInput(suggestion);
    setShowSuggestions(false);
    performSearch(suggestion);
  };

  // Realizar busca
  const performSearch = (query: string) => {
    if (query.trim().length === 0) {
      setResults([]);
      return;
    }

    const field = selectedTab === "marca" ? "ItemMarca" : "ItemModelo";
    const filtered = data.filter(
      (item) => item[field].toLowerCase() === query.toLowerCase()
    );

    setResults(filtered);
  };

  // Buscar ao pressionar Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      performSearch(searchInput);
      setShowSuggestions(false);
    }
  };

  // Mudar aba
  const handleTabChange = (tab: "marca" | "modelo") => {
    setSelectedTab(tab);
    setSearchInput("");
    setSuggestions([]);
    setResults([]);
    setShowSuggestions(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-slate-900">
            {APP_TITLE || "Buscador de Equipamentos"}
          </h1>
          <p className="text-slate-600 mt-2">
            Busque por marca ou modelo de equipamentos registrados
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Search Card */}
        <Card className="mb-8 shadow-lg border-slate-200">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200">
            <CardTitle className="text-xl text-slate-900">Buscar Equipamento</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => handleTabChange("marca")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedTab === "marca"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Buscar por Marca
              </button>
              <button
                onClick={() => handleTabChange("modelo")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedTab === "modelo"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Buscar por Modelo
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    type="text"
                    placeholder={`Digite a ${selectedTab === "marca" ? "marca" : "modelo"}...`}
                    value={searchInput}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyPress={handleKeyPress}
                    onFocus={() => searchInput && setShowSuggestions(true)}
                    className="w-full px-4 py-3 text-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  {/* Suggestions Dropdown */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                      {suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSelectSuggestion(suggestion)}
                          className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors border-b border-slate-100 last:border-b-0 text-slate-900"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <Button
                  onClick={() => performSearch(searchInput)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Buscar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {results.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Resultados ({results.length})
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {results.map((item, idx) => (
                <Card key={idx} className="hover:shadow-lg transition-shadow border-slate-200">
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                          Marca
                        </p>
                        <p className="text-lg font-semibold text-slate-900">
                          {item.ItemMarca}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                          Modelo
                        </p>
                        <p className="text-sm text-slate-700 break-words">
                          {item.ItemModelo}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                          Número de Registro
                        </p>
                        <p className="text-sm font-mono text-slate-700">
                          {item.NumeroRegistro}
                        </p>
                      </div>
                      <Button
                        asChild
                        className="w-full bg-green-600 hover:bg-green-700 text-white mt-4"
                      >
                        <a
                          href={item.LINK}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Ver Detalhes
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {searchInput && results.length === 0 && !showSuggestions && (
          <Card className="border-slate-200 bg-slate-50">
            <CardContent className="pt-8 pb-8 text-center">
              <p className="text-slate-600 text-lg">
                Nenhum equipamento encontrado para "{searchInput}"
              </p>
              <p className="text-slate-500 text-sm mt-2">
                Tente buscar por outro termo ou verifique a ortografia
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
