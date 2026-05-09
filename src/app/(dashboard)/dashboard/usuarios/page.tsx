"use client";

import { useEffect, useState } from "react";
import { 
  Users, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X,
  Save,
  UserCheck,
  Shield,
  Key
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  nome: string;
  login: string;
  senha?: string;
}

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    login: "",
    senha: ""
  });

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const data = await api.get<User[]>("/");
      setUsuarios(data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleOpenModal = (user: User | null = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        nome: user.nome,
        login: user.login,
        senha: "" // Não carregar senha por segurança
      });
    } else {
      setEditingUser(null);
      setFormData({
        nome: "",
        login: "",
        senha: ""
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await api.put(`/${editingUser.id}`, formData);
      } else {
        await api.post("/signup", formData);
      }
      handleCloseModal();
      fetchUsuarios();
    } catch (error) {
      alert("Erro ao salvar usuário");
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
      try {
        await api.delete(`/${id}`);
        fetchUsuarios();
      } catch (error) {
        alert("Erro ao excluir usuário");
        console.error(error);
      }
    }
  };

  const filteredUsers = usuarios.filter(u => 
    u.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.login.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-ws-text-primary uppercase tracking-tighter">Gerenciamento de Usuários</h1>
          <p className="text-sm text-ws-text-secondary">Administre as contas e acessos do sistema.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ws-text-secondary" />
            <input 
              type="text" 
              placeholder="Buscar usuários..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-ws-bg-secondary border border-white/5 rounded-xl pl-10 pr-4 py-2 text-sm text-ws-text-primary focus:outline-none focus:ring-2 focus:ring-ws-accent-blue/30 w-full md:w-64 transition-all"
            />
          </div>
          <Button onClick={() => handleOpenModal()} size="sm" className="flex gap-2">
            <Plus className="w-4 h-4" />
            Novo Usuário
          </Button>
        </div>
      </div>

      {/* Lista de Usuários */}
      <Card className="p-0 border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-ws-text-secondary">Usuário</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-ws-text-secondary">Login / E-mail</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-ws-text-secondary">Status</th>
                <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-ws-text-secondary text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-ws-text-secondary">Carregando usuários...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-ws-text-secondary">Nenhum usuário encontrado.</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-ws-accent-blue/10 flex items-center justify-center text-ws-accent-blue border border-ws-accent-blue/20 group-hover:bg-ws-accent-blue group-hover:text-white transition-all">
                          <Users className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-ws-text-primary">{user.nome}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-ws-text-secondary">{user.login}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="green">Ativo</Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-9 w-9 p-0 rounded-lg border border-white/5 hover:border-ws-accent-blue/30"
                          onClick={() => handleOpenModal(user)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-9 w-9 p-0 rounded-lg border border-white/5 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/20"
                          onClick={() => handleDelete(user.id)}
                        >
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

      {/* Modal de Cadastro/Edição */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-ws-bg-secondary border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-ws-accent-blue/10 rounded-lg text-ws-accent-blue">
                  {editingUser ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
                <h2 className="text-xl font-bold text-ws-text-primary">
                  {editingUser ? "Editar Usuário" : "Novo Usuário"}
                </h2>
              </div>
              <button 
                onClick={handleCloseModal}
                className="p-2 text-ws-text-secondary hover:text-white hover:bg-white/5 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-ws-text-secondary uppercase tracking-widest ml-1">Nome Completo</label>
                <div className="relative">
                  <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ws-text-secondary" />
                  <Input 
                    required
                    placeholder="Ex: João Silva" 
                    className="pl-12"
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-ws-text-secondary uppercase tracking-widest ml-1">Login / E-mail</label>
                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ws-text-secondary" />
                  <Input 
                    required
                    type="email"
                    placeholder="joao@empresa.com" 
                    className="pl-12"
                    value={formData.login}
                    onChange={(e) => setFormData({...formData, login: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-ws-text-secondary uppercase tracking-widest ml-1">Senha</label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ws-text-secondary" />
                  <Input 
                    required={!editingUser}
                    type="password"
                    placeholder="••••••••" 
                    className="pl-12"
                    value={formData.senha}
                    onChange={(e) => setFormData({...formData, senha: e.target.value})}
                  />
                </div>
                {editingUser && (
                  <p className="text-[10px] text-ws-text-secondary mt-1 ml-1 italic">
                    Deixe em branco para manter a senha atual.
                  </p>
                )}
              </div>

              <div className="pt-4 flex gap-3">
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="flex-1"
                  onClick={handleCloseModal}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  variant="primary" 
                  className="flex-1 gap-2"
                >
                  <Save className="w-4 h-4" />
                  Salvar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
