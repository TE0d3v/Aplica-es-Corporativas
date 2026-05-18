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
  Key,
  AlertCircle,
  CheckCircle2,
  Trash
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

interface User {
  usuario_id: string;
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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  
  // Notification states
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  
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
      showNotification('error', "Não foi possível carregar a lista de usuários.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleOpenModal = (user: User | null = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        nome: user.nome,
        login: user.login,
        senha: "" 
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

  const handleOpenDeleteModal = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await api.put(`/${editingUser.usuario_id}`, formData);
        showNotification('success', "Usuário atualizado com sucesso!");
      } else {
        await api.post("/signup", formData);
        showNotification('success', "Novo usuário cadastrado com sucesso!");
      }
      handleCloseModal();
      fetchUsuarios();
    } catch (error: any) {
      showNotification('error', error.message || "Ocorreu um erro ao salvar o usuário.");
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    
    const userId = userToDelete.usuario_id;

    if (!userId) {
      showNotification('error', "ID do usuário não encontrado.");
      return;
    }

    try {
      await api.delete(`/${userId}`);
      showNotification('success', "Usuário excluído com sucesso.");
      handleCloseDeleteModal();
      fetchUsuarios();
    } catch (error: any) {
      showNotification('error', error.message || "Erro ao excluir usuário.");
      console.error(error);
    }
  };

  const filteredUsers = usuarios.filter(u => 
    u.nome?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.login?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Notificações */}
      {notification && (
        <div className={cn(
          "fixed top-24 right-8 z-100 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border animate-in slide-in-from-right-8 duration-300",
          notification.type === 'success' ? "bg-ws-accent-green/10 border-ws-accent-green/20 text-ws-accent-green" : "bg-red-500/10 border-red-500/20 text-red-500"
        )}>
          {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-ws-text-primary uppercase tracking-tighter">Gerenciamento de Usuários</h1>
          <p className="text-sm text-ws-text-secondary">Administre as contas e permissões de acesso da plataforma.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ws-text-secondary" />
            <input 
              type="text" 
              placeholder="Filtrar por nome ou login..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-ws-bg-secondary border border-white/5 rounded-xl pl-10 pr-4 py-2 text-sm text-ws-text-primary focus:outline-none focus:ring-2 focus:ring-ws-accent-blue/30 w-full md:w-64 transition-all"
            />
          </div>
          <Button onClick={() => handleOpenModal()} size="sm" className="flex gap-2">
            <Plus className="w-4 h-4" />
            Adicionar Usuário
          </Button>
        </div>
      </div>

      {/* Lista de Usuários */}
      <Card className="p-0 border-white/5 overflow-hidden shadow-2xl shadow-black/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/2">
                <th className="px-6 py-5 text-[10px] uppercase font-black text-ws-text-secondary tracking-[0.2em]">Identificação</th>
                <th className="px-6 py-5 text-[10px] uppercase font-black text-ws-text-secondary tracking-[0.2em]">Acesso / Login</th>
                <th className="px-6 py-5 text-[10px] uppercase font-black text-ws-text-secondary tracking-[0.2em]">Status</th>
                <th className="px-6 py-5 text-[10px] uppercase font-black text-ws-text-secondary tracking-[0.2em] text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-2 border-ws-accent-blue border-t-transparent rounded-full animate-spin" />
                      <p className="text-sm text-ws-text-secondary font-medium">Sincronizando dados...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-ws-text-secondary opacity-50">
                      <Users className="w-10 h-10" />
                      <p className="text-sm">Nenhum usuário encontrado para sua busca.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.usuario_id} className="hover:bg-white/3 transition-all group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-linear-to-br from-ws-accent-blue/20 to-ws-accent-blue/5 flex items-center justify-center text-ws-accent-blue border border-ws-accent-blue/20 group-hover:scale-110 transition-transform">
                          <Users className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-ws-text-primary tracking-tight">{user.nome}</span>
                          <span className="text-[10px] text-ws-text-secondary uppercase font-bold tracking-widest">Colaborador</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-ws-text-secondary">
                        <Shield className="w-3.5 h-3.5" />
                        <span className="text-sm font-medium">{user.login}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <Badge variant="green" className="font-black">Ativo</Badge>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-10 w-10 p-0 rounded-xl border border-white/5 hover:border-ws-accent-blue/30 hover:text-ws-accent-blue"
                          onClick={() => handleOpenModal(user)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-10 w-10 p-0 rounded-xl border border-white/5 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/20"
                          onClick={() => handleOpenDeleteModal(user)}
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
        <div className="fixed inset-0 z-110 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-ws-bg-secondary border border-white/10 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,170,255,0.1)] overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between bg-white/2">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-ws-accent-blue/10 rounded-2xl text-ws-accent-blue border border-ws-accent-blue/20">
                  {editingUser ? <Edit2 className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-ws-text-primary uppercase tracking-tighter">
                    {editingUser ? "Editar Cadastro" : "Novo Cadastro"}
                  </h2>
                  <p className="text-xs text-ws-text-secondary uppercase font-bold tracking-widest mt-0.5">Módulo de Administração</p>
                </div>
              </div>
              <button 
                onClick={handleCloseModal}
                className="p-3 text-ws-text-secondary hover:text-white hover:bg-white/5 rounded-2xl transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              <div className="grid grid-cols-1 gap-8">
                <div className="space-y-3">
                  <label htmlFor="nome" className="text-[10px] font-black text-ws-text-secondary uppercase tracking-[0.2em] ml-1">Nome Completo</label>
                  <div className="relative">
                    <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ws-text-secondary" />
                    <Input 
                      id="nome"
                      required
                      placeholder="Nome do colaborador" 
                      className="pl-14 h-14 text-base"
                      value={formData.nome}
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label htmlFor="login" className="text-[10px] font-black text-ws-text-secondary uppercase tracking-[0.2em] ml-1">E-mail Corporativo (Login)</label>
                  <div className="relative">
                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ws-text-secondary" />
                    <Input 
                      id="login"
                      required
                      type="email"
                      placeholder="exemplo@wattsense.com" 
                      className="pl-14 h-14 text-base"
                      value={formData.login}
                      onChange={(e) => setFormData({...formData, login: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <label htmlFor="senha" className="text-[10px] font-black text-ws-text-secondary uppercase tracking-[0.2em]">Senha de Acesso</label>
                    {editingUser && <span className="text-[10px] text-ws-accent-blue font-bold uppercase tracking-widest">Opcional</span>}
                  </div>
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ws-text-secondary" />
                    <Input 
                      id="senha"
                      required={!editingUser}
                      type="password"
                      placeholder="••••••••••••" 
                      className="pl-14 h-14 text-base"
                      value={formData.senha}
                      onChange={(e) => setFormData({...formData, senha: e.target.value})}
                    />
                  </div>
                  {editingUser && (
                    <p className="text-[10px] text-ws-text-secondary mt-2 ml-1 italic opacity-60">
                      Preencha apenas se desejar redefinir a senha do usuário.
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="flex-1 h-14 text-sm font-bold uppercase tracking-widest rounded-2xl"
                  onClick={handleCloseModal}
                >
                  Descartar
                </Button>
                <Button 
                  type="submit" 
                  variant="primary" 
                  className="flex-1 h-14 text-sm font-bold uppercase tracking-widest rounded-2xl gap-3"
                >
                  <Save className="w-5 h-5" />
                  Confirmar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {isDeleteModalOpen && userToDelete && (
        <div className="fixed inset-0 z-120 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-ws-bg-secondary border border-red-500/20 rounded-[2.5rem] shadow-[0_0_100px_rgba(239,68,68,0.1)] overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 text-center space-y-6">
              <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center text-red-500 border border-red-500/20 mx-auto mb-4">
                <Trash className="w-10 h-10" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-ws-text-primary uppercase tracking-tighter">Confirmar Exclusão</h3>
                <p className="text-ws-text-secondary text-sm">
                  Você está prestes a remover permanentemente o acesso de <span className="text-ws-text-primary font-bold">{userToDelete.nome}</span>. Esta ação não pode ser desfeita.
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="flex-1 h-14 text-xs font-bold uppercase tracking-widest rounded-2xl"
                  onClick={handleCloseDeleteModal}
                >
                  Manter
                </Button>
                <Button 
                  type="button" 
                  className="flex-1 h-14 text-xs font-bold uppercase tracking-widest rounded-2xl bg-red-500 hover:bg-red-600 text-white shadow-red-500/20"
                  onClick={handleDelete}
                >
                  Sim, Excluir
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
