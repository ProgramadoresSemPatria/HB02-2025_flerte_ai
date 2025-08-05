# # Flerte-AI Mobile

Um aplicativo mobile de relacionamentos inteligentes desenvolvido com React Native e Expo.

## 🚀 Recursos Implementados

### ✅ Tela de Login
- Interface moderna e responsiva
- Campos de email e senha com validação
- Botão de "Esqueceu a senha?"
- Indicador de carregamento durante o login
- Botão para navegar para tela de registro
- Ícones intuitivos (Ionicons)
- Design com tema romântico (tons de rosa/vermelho)

### ✅ Tela de Registro
- Formulário completo com validações
- Campos: nome, email, senha e confirmação de senha
- Validação de força da senha (mínimo 6 caracteres)
- Validação de confirmação de senha
- Termos de uso e política de privacidade
- Navegação de volta para tela de login
- ScrollView para melhor experiência em telas menores

## 🛠 Tecnologias Utilizadas

- **React Native** - Framework para desenvolvimento mobile
- **Expo** - Plataforma de desenvolvimento
- **Expo Router** - Navegação entre telas
- **Expo Vector Icons** - Ícones do aplicativo
- **TypeScript** - Linguagem de programação

## 📱 Como Executar

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Iniciar o servidor de desenvolvimento:**
   ```bash
   npm start
   ```

3. **Executar no dispositivo:**
   - **Android:** Pressione `a` no terminal ou escaneie o QR code com o Expo Go
   - **iOS:** Escaneie o QR code com a câmera do iPhone
   - **Web:** Pressione `w` no terminal ou acesse http://localhost:8081

## 📁 Estrutura do Projeto

```
app/
├── _layout.tsx          # Layout principal da aplicação
├── index.tsx            # Tela de login (página inicial)
└── register.tsx         # Tela de registro de usuário

assets/
├── fonts/               # Fontes customizadas
└── images/              # Imagens e ícones

package.json             # Dependências e scripts
tsconfig.json           # Configuração TypeScript
app.json                # Configuração do Expo
```

## 🎨 Design

O aplicativo segue um design moderno com:
- **Paleta de cores:** Tons românticos (rosa/vermelho)
- **Tipografia:** Fontes limpa e legível
- **Componentes:** Botões com sombras e bordas arredondadas
- **Ícones:** Ionicons para consistência visual
- **UX:** Experiência de usuário fluida e intuitiva

## 🚧 Próximos Passos

- [ ] Implementar autenticação real (Firebase/Backend)
- [ ] Adicionar tela de recuperação de senha
- [ ] Criar tela principal do aplicativo
- [ ] Implementar perfil do usuário
- [ ] Adicionar sistema de matching
- [ ] Integrar chat em tempo real
- [ ] Implementar notificações push

## 📄 Licença

Este projeto está em desenvolvimento como parte do portfólio pessoal.

---

**Desenvolvido com ❤️ para conexões inteligentes**
