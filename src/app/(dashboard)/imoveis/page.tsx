"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Edit2, Trash2, X, Save, Home, MapPin, Building, Ruler, DollarSign, User, Info } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { api } from "@/lib/api";

// Definição do Tipo conforme o banco de dados
interface Imovel {
  imovel_id: number;
  endereco: string;
  valor: number;
  area: number;
  proprietario_id: number;
  imovel_tipo_id: number;
  atualizado_em: string;
  atualizado_por: number;
}

export default function ImoveisPage() {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingImovel, setEditingImovel] = useState<Imovel | null>(null);

   const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  
  // Estado para gerenciar o formulário
  const [formData, setFormData] = useState({
    endereco: "",
    valor: "",
    area: "",
    proprietario_id: "",
    imovel_tipo_id: ""
  });

  // Busca inicial dos imóveis (Read)
  const fetchImoveis = async () => {
    try {
      setLoading(true);
      const data = await api.get<Imovel[]>("/imoveis");
      setImoveis(data);
    } catch (error) {
      console.error("Erro ao buscar imóveis:", error);
      showNotification('error', "Não foi possível carregar a lista de imoveis.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImoveis();
  }, []);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleOpenModal = (imovel: Imovel | null = null) => {
    if (imovel) {
      setEditingImovel(imovel);
      setFormData({
        endereco: imovel.endereco,
        valor: imovel.valor.toString(),
        area: imovel.area.toString(),
        proprietario_id: imovel.proprietario_id.toString(),
        imovel_tipo_id: imovel.imovel_tipo_id.toString()
      });
    } else {
      setEditingImovel(null);
      setFormData({
        endereco: "", 
        valor: "", 
        area: "", 
        proprietario_id: "", 
        imovel_tipo_id: ""
      });
    }
    setIsModalOpen(true);
  };

  // Submit (Create/Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userJson = typeof window !== "undefined" ? localStorage.getItem("@WattSense:user") : null;
    const user = userJson ? JSON.parse(userJson) : null;
    const userId = user?.usuario_id || user?.idUsuario;

    if (!userId) {
      console.error("Usuário não autenticado.");
      alert("Erro de autenticação. Por favor, faça login novamente.");
      return;
    }

    const apiOptions = {
      headers: {
        'x-user-id': userId
      }
    };

    try {
      if (editingImovel) {
        const payload = {
          endereco: formData.endereco,
          valor: parseFloat(formData.valor),
          area: parseFloat(formData.area),
          imovel_tipo_id: parseInt(formData.imovel_tipo_id),
          proprietario_id: parseInt(formData.proprietario_id),
        };
        await api.put(`/imoveis/${editingImovel.imovel_id}`, payload, apiOptions);
      } else {
        const payload = {
          endereco: formData.endereco,
          valor: parseFloat(formData.valor),
          area: parseFloat(formData.area),
          imovel_tipo_id: parseInt(formData.imovel_tipo_id),
          proprietario_id: parseInt(formData.proprietario_id),
        };
        await api.post("/imoveis", payload, apiOptions);
      }
      setIsModalOpen(false);
      fetchImoveis();
    } catch (error) {
      console.error("Erro ao salvar o imóvel:", error);
      alert(`Ocorreu um erro ao salvar o imóvel. Verifique o console para mais detalhes.`);
    }
  };

  // Exclusão (Delete)
  const handleDelete = async (id: number) => {
    if (!window.confirm("Deseja realmente excluir este imóvel?")) return;
    
    try {
      await api.delete(`/imoveis/${id}`);
      fetchImoveis();
    } catch (error) {
      console.error("Erro ao excluir imóvel:", error);
    }
  };

  // Filtro de Busca Básico
  const filteredImoveis = imoveis.filter(i => 
    i.endereco.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-ws-text-primary uppercase tracking-tighter">Gerenciamento de Imóveis</h1>
          <p className="text-sm text-ws-text-secondary">Controle todos os cadastros e detalhes de propriedades.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ws-text-secondary" />
            <input 
              type="text" 
              placeholder="Buscar por endereço..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-ws-bg-secondary border border-white/5 rounded-xl pl-10 pr-4 py-2 text-sm text-ws-text-primary focus:outline-none focus:ring-2 focus:ring-ws-accent-blue/30 w-full md:w-64 transition-all"
            />
          </div>
          <Button onClick={() => handleOpenModal()} size="sm" className="flex gap-2">
            <Plus className="w-4 h-4" />
            Adicionar Imóvel
          </Button>
        </div>
      </div>

      {/* Aviso Importante */}
      <div className="bg-ws-accent-blue/10 border border-ws-accent-blue/20 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-ws-accent-blue shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-bold text-ws-accent-blue">Atenção ao Proprietário</h3>
          <p className="text-xs text-ws-text-secondary mt-1">
            Para adicionar um imóvel, você deve inserir o <strong>ID exato</strong> do proprietário, que precisa já estar cadastrado na aba <strong>Pessoas</strong>.
          </p>
        </div>
      </div>

      {/* Listagem (Read) */}
      <Card className="p-0 border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/2">
                <th className="px-6 py-5 text-[10px] uppercase font-black text-ws-text-secondary tracking-[0.2em]">Imóvel / Endereço</th>
                <th className="px-6 py-5 text-[10px] uppercase font-black text-ws-text-secondary tracking-[0.2em]">Detalhes</th>
                <th className="px-6 py-5 text-[10px] uppercase font-black text-ws-text-secondary tracking-[0.2em] text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center text-ws-text-secondary">Carregando...</td>
                </tr>
              ) : filteredImoveis.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center text-ws-text-secondary">Nenhum imóvel encontrado.</td>
                </tr>
              ) : (
                filteredImoveis.map((imovel) => (
                  <tr key={imovel.imovel_id} className="hover:bg-white/3 transition-all group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-ws-accent-blue/10 flex items-center justify-center text-ws-accent-blue border border-ws-accent-blue/20">
                          <Home className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-ws-text-primary">{imovel.endereco}</span>
                          <span className="text-[10px] text-ws-text-secondary uppercase">Tipo: {imovel.imovel_tipo_id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1 text-sm text-ws-text-secondary">
                        <span className="flex items-center gap-1"><DollarSign className="w-3 h-3"/> Valor: R$ {imovel.valor.toLocaleString('pt-BR')}</span>
                        <span className="flex items-center gap-1"><Ruler className="w-3 h-3"/> Área: {imovel.area} m²</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleOpenModal(imovel)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-500/10" onClick={() => handleDelete(imovel.imovel_id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal - Formulário (Create/Update) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-ws-bg-secondary border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-ws-text-primary uppercase tracking-tight">
                {editingImovel ? "Editar Imóvel" : "Cadastrar Imóvel"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-ws-text-secondary hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label htmlFor="endereco" className="text-xs font-black text-ws-text-secondary uppercase">Endereço Completo</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ws-text-secondary" />
                  <Input id="endereco" required className="pl-10" value={formData.endereco} onChange={e => setFormData({...formData, endereco: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="valor" className="text-xs font-black text-ws-text-secondary uppercase">Valor (R$)</label>
                  <Input id="valor" type="number" step="0.01" required value={formData.valor} onChange={e => setFormData({...formData, valor: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="area" className="text-xs font-black text-ws-text-secondary uppercase">Área (m²)</label>
                  <Input id="area" type="number" step="0.01" required value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="imovel_tipo_id" className="text-xs font-black text-ws-text-secondary uppercase">ID Tipo Imóvel</label>
                  <div className="relative">
                     <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ws-text-secondary" />
                    <select 
                      id="imovel_tipo_id"
                      required 
                      className="w-full pl-10 bg-ws-bg-primary border border-white/10 rounded-xl px-4 py-3 text-ws-text-primary focus:ring-2 focus:ring-ws-accent-blue/30"
                      value={formData.imovel_tipo_id} 
                      onChange={e => setFormData({...formData, imovel_tipo_id: e.target.value})}
                    >
                      <option value="">Selecione...</option>
                      <option value="1">Residencial</option>
                      <option value="2">Comercial</option>
                      <option value="3">Industrial</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="proprietario_id" className="text-xs font-black text-ws-text-secondary uppercase">ID do Proprietário (Pessoa)</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ws-text-secondary" />
                    <Input id="proprietario_id" type="number" required className="pl-10" value={formData.proprietario_id} onChange={e => setFormData({...formData, proprietario_id: e.target.value})} />
                  </div>
                  <p className="text-[10px] text-ws-text-secondary/70 italic mt-1">Consulte esse ID na tela de Pessoas.</p>
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <Button type="button" variant="ghost" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                <Button type="submit" className="flex-1 gap-2"><Save className="w-4 h-4"/> Salvar Dados</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
