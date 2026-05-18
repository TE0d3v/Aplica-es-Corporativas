"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Edit2, Trash2, X, Save, User, Fingerprint, Calendar, Phone, Briefcase, RefreshCw, Info } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { api } from "@/lib/api";

// Definição do Tipo conforme o banco de dados
interface Pessoa {
  pessoa_id: number;
  nome: string;
  cpf: string;
  nascimento: string;
  telefone: string;
  pessoa_tipo_id: number;
  atualizado_por: number;
  atualizado_em: string;
}

export default function PessoasPage() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPessoa, setEditingPessoa] = useState<Pessoa | null>(null);
  
  // Estado para gerenciar o formulário
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    nascimento: "",
    telefone: "",
    pessoa_tipo_id: ""
  });

  // Busca inicial das pessoas (Read)
  const fetchPessoas = async () => {
    try {
      setLoading(true);
      const data = await api.get<Pessoa[]>("/pessoas");
      setPessoas(data);
    } catch (error: any) {
      console.error("Erro ao buscar pessoas:", error);
      alert(error.message || "Não foi possível carregar a lista de pessoas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPessoas();
  }, []);

  const handleOpenModal = (pessoa: Pessoa | null = null) => {
    if (pessoa) {
      setEditingPessoa(pessoa);
      // Formata a data de ISO para YYYY-MM-DD para o input type="date"
      const dateValue = pessoa.nascimento ? new Date(pessoa.nascimento).toISOString().split('T')[0] : "";
      
      setFormData({
        nome: pessoa.nome,
        cpf: pessoa.cpf,
        nascimento: dateValue || "",
        telefone: pessoa.telefone,
        pessoa_tipo_id: pessoa.pessoa_tipo_id.toString()
      });
    } else {
      setEditingPessoa(null);
      setFormData({
        nome: "", 
        cpf: "", 
        nascimento: "", 
        telefone: "", 
        pessoa_tipo_id: ""
      });
    }
    setIsModalOpen(true);
  };

  // Submit (Create/Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        nome: formData.nome,
        cpf: formData.cpf,
        nascimento: formData.nascimento,
        telefone: formData.telefone,
        pessoa_tipo_id: parseInt(formData.pessoa_tipo_id)
      };

      if (editingPessoa) {
        await api.put(`/pessoas/${editingPessoa.pessoa_id}`, payload);
      } else {
        await api.post("/pessoas", payload);
      }
      
      setIsModalOpen(false);
      fetchPessoas();
    } catch (error: any) {
      console.error("Erro ao salvar pessoa:", error);
      alert(error.message || "Ocorreu um erro ao salvar os dados.");
    }
  };

  // Exclusão (Delete)
  const handleDelete = async (id: number) => {
    if (!window.confirm("Deseja realmente excluir este cadastro?")) return;
    
    try {
      await api.delete(`/pessoas/${id}`);
      fetchPessoas();
    } catch (error: any) {
      console.error("Erro ao excluir pessoa:", error);
      alert(error.message || "Erro ao excluir.");
    }
  };

  // Filtro de Busca
  const filteredPessoas = pessoas.filter(p => 
    p.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.cpf.includes(searchTerm)
  );

  // Formatação de Data
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    // Ajuste de timezone para não exibir um dia a menos
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-ws-text-primary uppercase tracking-tighter">Gerenciamento de Pessoas</h1>
          <p className="text-sm text-ws-text-secondary">Controle de proprietários e usuários do sistema.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ws-text-secondary" />
            <input 
              type="text" 
              placeholder="Buscar por nome ou CPF..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-ws-bg-secondary border border-white/5 rounded-xl pl-10 pr-4 py-2 text-sm text-ws-text-primary focus:outline-none focus:ring-2 focus:ring-ws-accent-blue/30 w-full md:w-64 transition-all"
            />
          </div>
          <Button onClick={() => handleOpenModal()} size="sm" className="flex gap-2">
            <Plus className="w-4 h-4" />
            Adicionar Pessoa
          </Button>
        </div>
      </div>

      {/* Aviso Importante */}
      <div className="bg-ws-accent-blue/10 border border-ws-accent-blue/20 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-ws-accent-blue shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-bold text-ws-accent-blue">Dica Importante: Anote o ID!</h3>
          <p className="text-xs text-ws-text-secondary mt-1">
            Para cadastrar um Imóvel, você precisará informar quem é o proprietário dele. Após cadastrar uma pessoa aqui, <strong>anote o número do ID</strong> dela (que aparece abaixo do nome na lista) para usar na tela de Imóveis.
          </p>
        </div>
      </div>

      {/* Listagem (Read) */}
      <Card className="p-0 border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/2">
                <th className="px-6 py-5 text-[10px] uppercase font-black text-ws-text-secondary tracking-[0.2em]">Pessoa / Nome</th>
                <th className="px-6 py-5 text-[10px] uppercase font-black text-ws-text-secondary tracking-[0.2em]">CPF & Contato</th>
                <th className="px-6 py-5 text-[10px] uppercase font-black text-ws-text-secondary tracking-[0.2em]">Nascimento</th>
                <th className="px-6 py-5 text-[10px] uppercase font-black text-ws-text-secondary tracking-[0.2em] text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-ws-text-secondary">Carregando...</td>
                </tr>
              ) : filteredPessoas.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-ws-text-secondary">Nenhuma pessoa encontrada.</td>
                </tr>
              ) : (
                filteredPessoas.map((pessoa) => (
                  <tr key={pessoa.pessoa_id} className="hover:bg-white/3 transition-all group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-ws-accent-amber/10 flex items-center justify-center text-ws-accent-amber border border-ws-accent-amber/20">
                          <User className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-ws-text-primary">{pessoa.nome}</span>
                          <span className="text-[10px] text-ws-text-secondary uppercase">ID: {pessoa.pessoa_id} | Tipo: {pessoa.pessoa_tipo_id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1 text-sm text-ws-text-secondary">
                        <span className="flex items-center gap-2"><Fingerprint className="w-3 h-3 text-ws-accent-blue"/> {pessoa.cpf}</span>
                        <span className="flex items-center gap-2"><Phone className="w-3 h-3 text-ws-accent-green"/> {pessoa.telefone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                       <span className="flex items-center gap-2 text-sm text-ws-text-secondary">
                        <Calendar className="w-3 h-3"/> {formatDate(pessoa.nascimento)}
                       </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleOpenModal(pessoa)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-500/10" onClick={() => handleDelete(pessoa.pessoa_id)}>
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
                {editingPessoa ? "Editar Cadastro" : "Nova Pessoa"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-ws-text-secondary hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label htmlFor="nome" className="text-xs font-black text-ws-text-secondary uppercase">Nome Completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ws-text-secondary" />
                  <Input id="nome" required className="pl-10" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="cpf" className="text-xs font-black text-ws-text-secondary uppercase">CPF</label>
                  <div className="relative">
                    <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ws-text-secondary" />
                    <Input id="cpf" placeholder="000.000.000-00" required className="pl-10" value={formData.cpf} onChange={e => setFormData({...formData, cpf: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="telefone" className="text-xs font-black text-ws-text-secondary uppercase">Telefone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ws-text-secondary" />
                    <Input id="telefone" placeholder="(00) 00000-0000" required className="pl-10" value={formData.telefone} onChange={e => setFormData({...formData, telefone: e.target.value})} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="nascimento" className="text-xs font-black text-ws-text-secondary uppercase">Data de Nascimento</label>
                  <Input id="nascimento" type="date" required value={formData.nascimento} onChange={e => setFormData({...formData, nascimento: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="pessoa_tipo_id" className="text-xs font-black text-ws-text-secondary uppercase">Tipo de Pessoa</label>
                   <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ws-text-secondary" />
                    <select 
                      id="pessoa_tipo_id"
                      required 
                      className="w-full pl-10 bg-ws-bg-primary border border-white/10 rounded-xl px-4 py-3 text-ws-text-primary focus:ring-2 focus:ring-ws-accent-blue/30"
                      value={formData.pessoa_tipo_id} 
                      onChange={e => setFormData({...formData, pessoa_tipo_id: e.target.value})}
                    >
                      <option value="">Selecione...</option>
                      <option value="1">Pessoa Física</option>
                      <option value="2">Pessoa Jurídica</option>
                    </select>
                  </div>
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
